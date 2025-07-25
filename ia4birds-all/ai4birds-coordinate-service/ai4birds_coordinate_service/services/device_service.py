from .base_service import BaseService

class DeviceService(BaseService):
    """Service for handling device status operations."""
    
    def post_device_status(self, data):
        """Sends device status data to ingestion service."""
        return self._make_request('post', 'device-status/', json=data)
    
    def get_latest_device_status(self):
        """Gets latest device status from ingestion service."""
        return self._make_request('get', 'device-status/latest')
    
    def get_device_health(self):
        """Gets device health status from ingestion service."""
        return self._make_request('get', 'device-status/health')