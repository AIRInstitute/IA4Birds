
from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.data_heatmap.data_heatmap_model import DataHeatmapModel, DataHeatmap

class DataHeatmapService:
    """Service for handling data heatmap operations."""
    
    def __init__(self):
        self.model = DataHeatmapModel()

    
    def add_heatmap(self, camera_id:str, heatmap_for:str, image_url:str, generated_at:str) -> object:
        """Add new data heatmap entry.

        Args:
            camera_id (str): Camera ID
            heatmap_for (str): Heatmap for
            image_url (str): Image URL
            generated_at (str): Generated at timestamp

        Returns:
            tuple: Result message and status code
        """
        logger.info("Adding new data heatmap")
        
        try:
            data = DataHeatmap(
                camera_id=camera_id,
                heatmap_for=heatmap_for,
                image_url=image_url,
                generated_at=generated_at
            )
            result = self.model.add(data)
            
            if result:
                return {"message": "Data heatmap added successfully"}, 200
            else:
                return {"error": "Failed to add heatmap data"}, 500
        except Exception as e:
            logger.error(f"Error adding data heatmap: {e}")
            return {"error": f"Failed to add data heatmap: {str(e)}"}, 500
    

    def get_latest_heatmap(self, camera_id: str) -> object:
        """Get latest data heatmap by camera_id.

        Args:
            camera_id (str): Camera ID
        Returns:
            tuple: Data heatmap and status code
        """
        logger.info("Getting latest data heatmap")
        
        try:
            data = self.model.fetch_latest(camera_id)
            return (data, 200) if data else ({"error": "No data found"}, 404)
        except Exception as e:
            logger.error(f"Error retrieving latest heatmap data: {e}")
            return {"error": f"Failed to retrieve latest heatmap data: {str(e)}"}, 500