import asyncio
import aiohttp
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception
from aiohttp import ClientResponseError
from ai4birds_ingest_service import config, logger


class XenoCantoAPIError(RuntimeError):
    """Non-retriable API error (bad query/key/etc.)."""
    pass


class XenoCanto_Extractor_Async:
    BASE_URL = "https://xeno-canto.org/api/3/recordings"

    def __init__(self, max_concurrent_requests=5):
        self.semaphore = asyncio.Semaphore(max_concurrent_requests)

        # Required in API v3
        self.api_key = getattr(config, "XENOCANTO_API_KEY", None)
        if not self.api_key:
            raise RuntimeError("Missing config.XENOCANTO_API_KEY (load it from .env)")

        # Optional tuning
        self.per_page = int(getattr(config, "XENOCANTO_PER_PAGE", 100))
        self.per_page = max(50, min(self.per_page, 500))  # enforce 50..500

        self.query = getattr(config, "XENOCANTO_QUERY", "cnt:spain+grp:birds")

        self._headers = {
            "User-Agent": "ai4birds-ingest-service/1.0 (+contact: air-institute)",
            "Accept": "application/json",
        }
        self._timeout = aiohttp.ClientTimeout(total=60)

    def _is_retriable(self, exc: Exception) -> bool:
        # Retry only on rate limit + transient server/network errors
        if isinstance(exc, ClientResponseError):
            return exc.status in (429, 500, 502, 503, 504)
        return isinstance(exc, (aiohttp.ClientConnectorError, asyncio.TimeoutError))

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception(lambda e: XenoCanto_Extractor_Async._static_is_retriable(e)),
        reraise=True,
    )
    async def fetch_page(self, session: aiohttp.ClientSession, page: int) -> dict:
        """
        Fetch a specific page of recordings from Xeno-Canto API v3.
        """
        async with self.semaphore:
            params = {
                "query": self.query,        # must be tag-based in v3
                "key": self.api_key,        # required in v3
                "per_page": self.per_page,  # 50..500
                "page": page,               # 1..numPages
            }

            async with session.get(self.BASE_URL, params=params) as resp:
                # Explicit 429 handling so tenacity retries
                if resp.status == 429:
                    raise ClientResponseError(
                        request_info=resp.request_info,
                        history=resp.history,
                        status=resp.status,
                        message="Too Many Requests",
                        headers=resp.headers,
                    )

                # If error: try JSON payload {"error":{...}}
                if resp.status >= 400:
                    try:
                        payload = await resp.json()
                    except Exception:
                        text = await resp.text()
                        raise XenoCantoAPIError(f"HTTP {resp.status} from Xeno-Canto. Body: {text[:300]}")

                    if isinstance(payload, dict) and "error" in payload:
                        err = payload["error"]
                        code = err.get("code", "unknown_error")
                        msg = err.get("message", "")
                        # Do NOT retry on 400/401/403/404 because it's usually query/key
                        raise XenoCantoAPIError(f"HTTP {resp.status} {code}: {msg}")

                    raise XenoCantoAPIError(f"HTTP {resp.status} from Xeno-Canto. Payload: {str(payload)[:300]}")

                return await resp.json()

    @staticmethod
    def _static_is_retriable(exc: Exception) -> bool:
        if isinstance(exc, ClientResponseError):
            return exc.status in (429, 500, 502, 503, 504)
        return isinstance(exc, (aiohttp.ClientConnectorError, asyncio.TimeoutError))

    async def xenocanto_query(self):
        """
        Query the Xeno-Canto API and filter recordings located in Castilla y León.
        Uses async requests to fetch all pages concurrently.
        """
        connector = aiohttp.TCPConnector(limit=50)

        async with aiohttp.ClientSession(
            timeout=self._timeout,
            headers=self._headers,
            connector=connector,
        ) as session:
            first_page = await self.fetch_page(session, 1)
            total_pages = int(first_page.get("numPages", 1))
            all_data = list(first_page.get("recordings", []))

            tasks = [self._safe_fetch_page(session, p) for p in range(2, total_pages + 1)]
            if tasks:
                results = await asyncio.gather(*tasks)
                for page_data in results:
                    if page_data:
                        all_data.extend(page_data.get("recordings", []))

            filtered = [r for r in all_data if "Castilla y León" in (r.get("loc") or "")]
            return self._format_results(filtered)

    async def _safe_fetch_page(self, session: aiohttp.ClientSession, page: int):
        """
        Wrapper for fetch_page to catch and log errors without stopping the whole process.
        """
        try:
            return await self.fetch_page(session, page)
        except Exception as e:
            logger.warning(f"Failed to fetch page {page} after retries: {e}")
            return None

    def _format_results(self, data):
        """
        Format raw bird recordings data to include only species in the configured list.

        IMPORTANT: parse fields are the same as your v2 code; v3 keeps these fields.
        """
        species_list = set(config.SPECIES_LIST.values())
        formatted_results = []

        for bird in data:
            try:
                sci_name = f"{bird.get('gen')} {bird.get('sp')}".strip()
                if sci_name not in species_list:
                    continue

                required_fields = ['id', 'loc', 'q', 'lat', 'lon', 'alt', 'file', 'file-name', 'time', 'date']
                if not all(field in bird and bird[field] not in [None, ''] for field in required_fields):
                    logger.warning(f"Skipping incomplete bird record: {bird}")
                    continue

                formatted_results.append({
                    "speciesSciName": sci_name,
                    "recordings": [{
                        "recordingId": bird.get('id'),
                        "location": bird.get('loc'),
                        "quality": bird.get('q'),
                        "lat": bird.get('lat'),
                        "lon": bird.get('lon'),
                        "alt": bird.get('alt'),
                        "file": bird.get('file'),
                        "file-name": bird.get('file-name'),
                        "time": bird.get('time'),
                        "date": bird.get('date')
                    }]
                })
            except Exception as e:
                logger.warning(f"Error formatting bird record: {e} | Record: {bird}")

        return formatted_results
