import requests
from ai4birds_coordinate_service import config
from .base_service import BaseService

class MapService(BaseService):
    """Service for handling map-related operations."""
    
    def post_wind_map_data(self, data):
        """Sends wind map data to ingestion service."""
        return self._make_request('post', 'windmap/', json=data)
    
    def post_exclusion_map_data(self, data):
        """Sends exclusion map data to ingestion service."""
        return self._make_request('post', 'exclusionmap/', json=data)
    
    def get_exclusion_map_zip(self):
        """Gets exclusion map ZIP file from ingestion service."""
        url = f"{config.URL_INGEST}/exclusionmap/zip"
        try:
            response = requests.get(url)
            if response.status_code != 200:
                response.raise_for_status()
                
            return (response.content, 200, {
                "Content-Type": "application/zip",
                "Content-Disposition": "attachment; filename=data.zip"
            })
        except Exception as e:
            self.logger.error(f"[ExclusionMapZip] Exception: {e}")
            return {"error": "Failed to download exclusion map ZIP."}, 500
    
    def get_all_exclusion_map_data(self):
        """Gets all exclusion map data from ingestion service."""
        return self._make_request('get', 'exclusionmap/all')
    
    def stream_exclusion_data(self, data):
        """Streams exclusion data to ingestion service."""
        return self._make_request('post', 'exclusionmap/stream-exclusion-data', json=data)