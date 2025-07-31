from .base_service import BaseService

class MqttService(BaseService):
    """Service for handling mqtt data operations."""
        
    def get_segment_data(self, camera_id):
        """Gets segment data from ingestion service."""
        return self._make_request('get', f'segment-data?camera_id={camera_id}')
    
    def get_heatmap_data(self, camera_id):
        """Gets heatmap data from ingestion service."""
        return self._make_request('get', f'heatmap-data?camera_id={camera_id}')