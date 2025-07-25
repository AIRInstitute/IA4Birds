import requests
from ai4birds_coordinate_service import config
from ai4birds_coordinate_service.log import serve_application_logger

logger = serve_application_logger()

class BaseService:
    """Base service class with common functionality for API calls."""
    
    def __init__(self):
        self.logger = logger
    
    def _make_request(self, method, endpoint, json=None):
        """
        Makes an HTTP request to the ingestion service.
        
        Args:
            method (str): HTTP method (get, post, etc.)
            endpoint (str): The endpoint to call
            json (dict, optional): JSON data to send
            
        Returns:
            tuple: (data, status_code) or (error_dict, error_code)
        """
        url = f"{config.URL_INGEST}/{endpoint}"
        
        try:
            if method.lower() == 'get':
                response = requests.get(url)
            elif method.lower() == 'post':
                response = requests.post(url, json=json)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            if response.status_code != 200:
                response.raise_for_status()
                
            return response.json(), 200
            
        except requests.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            self.logger.error(f"[{endpoint}] Error response: {response.status_code} - {response.text}")
            return {"error": f"Failed to fetch data: {error_message}"}, response.status_code
            
        except requests.exceptions.RequestException as e:
            self.logger.error(f"[{endpoint}] Exception during request: {e}")
            return {"error": f"Failed to contact ingestion API for {endpoint}."}, 500
            
        except ValueError as e:
            self.logger.error(f"[{endpoint}] Invalid JSON response or request: {e}")
            return {"error": "Ingestion API returned invalid JSON or invalid request."}, 500