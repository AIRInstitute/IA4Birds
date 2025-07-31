from .base_service import BaseService

class StatisticsService(BaseService):
    """Service for handling statistics operations."""

    def get_bird_statistics(self, camera_id, bird_name):
        """Gets all bird statistics for camera_id from ingestion service."""
        return self._make_request('get', f'bird-statistics?camera_id={camera_id}&bird_name={bird_name}')
    
    def get_bird_statistics_by_camera(self, camera_id):
        """Gets all camera statistics from ingestion service."""
        return self._make_request('get', f'bird-statistics/by-camera?camera_id={camera_id}')