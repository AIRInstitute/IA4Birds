from .base_service import BaseService

class BirdDataService(BaseService):
    """Service for handling bird observation and audio data."""
    
    def get_ebird_data(self):
        """Retrieves bird observation data from eBird API."""
        return self._make_request('get', 'ebird/')
        
    def get_xenocanto_data(self):
        """Retrieves bird sound recordings from XenoCanto API."""
        return self._make_request('get', 'xenocanto/')
    
    def get_sensitivity_data(self):
        """Retrieves bird sensitivity zone data."""
        return self._make_request('get', 'sensitivity/')
    
    def get_combined_bird_data(self):
        """Retrieves combined eBird and XenoCanto data."""
        return self._make_request('get', 'dataBird/')