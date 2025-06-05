import asyncio
import aiohttp
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from aiohttp import ClientResponseError
from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import logger

class XenoCanto_Extractor_Async:
    BASE_URL = 'http://www.xeno-canto.org/api/2/recordings?query=cnt:spain&page={}'

    def __init__(self, max_concurrent_requests=5):
        self.semaphore = asyncio.Semaphore(max_concurrent_requests)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type(ClientResponseError),
        reraise=True
    )

    async def fetch_page(self, session, page):
        """
        Fetch a specific page of recordings from the Xeno-Canto API.

        Args:
            session (aiohttp.ClientSession): The HTTP session to use for the request.
            page (int): The page number to request.

        Returns:
            dict: A JSON-decoded response containing recordings and pagination info.
        """
        async with self.semaphore:
            async with session.get(self.BASE_URL.format(page)) as resp:
                resp.raise_for_status()
                return await resp.json()

    async def xenocanto_query(self):
        """
        Query the Xeno-Canto API to obtain recordings of birds specific to Spain,
        filtering for those located in Castilla y León. Uses asynchronous requests
        to fetch all pages concurrently for improved performance.

        Returns:
            list: A list of formatted dictionaries, each representing bird recordings.
        """
        async with aiohttp.ClientSession() as session:
            first_page = await self.fetch_page(session, 1)
            total_pages = first_page['numPages']
            all_data = first_page['recordings']

            tasks = []
            for p in range(2, total_pages + 1):
                tasks.append(self._safe_fetch_page(session, p))

            results = await asyncio.gather(*tasks)

            # return results, all_data

            for page_data in results:
                if page_data:
                    all_data.extend(page_data['recordings'])

            filtered = [r for r in all_data if 'Castilla y León' in r.get('loc')]
            return self._format_results(filtered)
    


    def join_page_data(self, results, all_data):

        for page_data in results:
                if page_data:
                    all_data.extend(page_data['recordings'])

        filtered = [r for r in all_data if 'Castilla y León' in r.get('loc')]
        return self._format_results(filtered)
    

    async def _safe_fetch_page(self, session, page):
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

        Args:
            data (list): A list of raw recordings dictionaries.

        Returns:
            list: A list of dictionaries with formatted species and recording details.
        """
        species_list = config.SPECIES_LIST.values()
        return [{
            "speciesSciName": f"{bird['gen']} {bird['sp']}",
            "recordings": [{
                "recordingId": bird['id'],
                "location": bird['loc'],
                "quality": bird['q'],
                "lat": bird['lat'],
                "lng": bird['lng'],
                "alt": bird['alt'],
                "file": bird['file'],
                "file-name": bird['file-name'],
                "time": bird['time'],
                "date": bird['date']
            }]
        } for bird in data if f"{bird['gen']} {bird['sp']}" in species_list]
