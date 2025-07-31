
from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.data_segment.data_segment_model import DataSegmentModel, DataSegment


class DataSegmentService:
    """Service for handling data segment operations."""

    def __init__(self):
        self.model = DataSegmentModel()

    
    def add_segment(self, camera_id: str, segment_idx: int, colatitude: float, azimuth: float, zoom_level: int, average_area: float, total_big_birds: int, frames: str, received_at: str) -> object:
        """Add new data segment entry.
        
        Args:
            camera_id (str): Camera ID
            segment_idx (int): Segment index
            colatitude (float): Colatitude
            azimuth (float): Azimuth
            zoom_level (int): Zoom level
            average_area (float): Average area
            total_big_birds (int): Total big birds
            frames (str): Frames
            received_at (str): Received at timestamp
            
        Returns:
            tuple: Result message and status code
        """
        logger.info("Adding new segment data")
        
        try:
            data = DataSegment(
                camera_id=camera_id,
                segment_idx=segment_idx,
                colatitude=colatitude,
                azimuth=azimuth,
                zoom_level=zoom_level,
                average_area=average_area,
                total_big_birds=total_big_birds,
                frames=frames,
                received_at=received_at
            )
            result = self.model.add(data)
            
            if result:
                return {"message": "Segment Data added successfully"}, 200
            else:
                return {"error": "Failed to add segment data"}, 500
        except Exception as e:
            logger.error(f"Error adding data segment: {e}")
            return {"error": f"Failed to add segment data: {str(e)}"}, 500
    

    def get_data_segment(self, camera_id: str) -> object:
        """Get data segment by camera_id.

        Args:
            id (int): Camera ID

        Returns:
            tuple: Data segment and status code
        """
        logger.info("Getting data segment by camera_id")
        
        try:
            data = self.model.fetch_content(camera_id)
            return (data, 200) if data else ({"error": "No data found"}, 404)
        except Exception as e:
            logger.error(f"Error retrieving data segment by camera_id: {e}")
            return {"error": f"Failed to retrieve data segment by camera_id: {str(e)}"}, 500

