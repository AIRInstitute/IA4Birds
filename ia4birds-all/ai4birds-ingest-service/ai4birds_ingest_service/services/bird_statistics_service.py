
from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.bird_statistics.bird_statistics_model import BirdStatisticsModel, BirdStatistics

class BirdStatisticsService:
    """Service for handling bird statistics operations."""
    
    def __init__(self):
        self.model = BirdStatisticsModel()

    
    def add_statistics(self, camera_id:str, bird_name:str, count:int, last_seen:str, created_at:str) -> object:
        """Add new bird statistics entry.

        Args:
            camera_id (str): Camera ID
            bird_name (str): Bird name
            count (int): Count
            last_seen (str): Last seen timestamp
            created_at (str): Created at timestamp

        Returns:
            tuple: Result message and status code
        """
        logger.info("Adding new bird statistics")
        
        try:
            data = BirdStatistics(
                camera_id=camera_id,
                bird_name=bird_name,
                count=count,
                last_seen=last_seen,
                created_at=created_at
            )
            result = self.model.add_statistics(data)
            
            if result:
                return {"message": "Bird statistics added successfully"}, 200
            else:
                return {"error": "Failed to add bird statistics"}, 500
        except Exception as e:
            logger.error(f"Error adding bird statistics: {e}")
            return {"error": f"Failed to add bird statistics: {str(e)}"}, 500
    

    def update_statistics(self, camera_id:str, bird_name:str, count:int, last_seen:str) -> object:
        """Update bird statistics entry.

        Args:
            count (int): Count
            last_seen (str): Last seen timestamp
            camera_id (str): Camera ID
            bird_name (str): Bird name

        Returns:
            tuple: Result message and status code
        """
        logger.info("Updating bird statistics")
        
        try:
            data = BirdStatistics(
                camera_id=camera_id,
                bird_name=bird_name,
                count=count,
                last_seen=last_seen,
                created_at=None
            )
            result = self.model.update_statistics(data)
            
            if result:
                return {"message": "Bird statistics updated successfully"}, 200
            else:
                return {"error": "Failed to update bird statistics"}, 500
        except Exception as e:
            logger.error(f"Error updating bird statistics: {e}")
            return {"error": f"Failed to update bird statistics: {str(e)}"}, 500
    

    def get_latest_statistics(self, camera_id: int, bird_name: str) -> object:
        """Get latest bird statistics by camera_id and bird_name.

        Args:
            camera_id (int): Camera ID
            bird_name (str): Bird name

        Returns:
            tuple: Bird statistics and status code
        """
        logger.info("Getting latest bird statistics")
        
        try:
            data = self.model.fetch_content(camera_id, bird_name)
            return (data, 200) if data else ({"error": "No data found"}, 404)
        except Exception as e:
            logger.error(f"Error retrieving latest bird statistics: {e}")
            return {"error": f"Failed to retrieve latest bird statistics: {str(e)}"}, 500
    

    def get_latest_statistics_by_camera(self, camera_id: int) -> object:
        """Get latest bird statistics by camera_id.

        Args:
            camera_id (int): Camera ID

        Returns:
            tuple: Bird statistics and status code
        """
        logger.info("Getting latest bird statistics by camera_id")
        
        try:
            data = self.model.fetch_content_by_camera(camera_id)
            return (data, 200) if data else ({"error": "No data found"}, 404)
        except Exception as e:
            logger.error(f"Error retrieving latest bird statistics by camera_id: {e}")
            return {"error": f"Failed to retrieve latest bird statistics by camera_id: {str(e)}"}, 500