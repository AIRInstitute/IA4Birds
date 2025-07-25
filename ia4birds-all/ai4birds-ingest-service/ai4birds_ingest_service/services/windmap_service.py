from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.extractor.windmap_extractor import WindMap_Extractor

logger = serve_application_logger()

class WindMapService:
    """Service for handling wind map data operations."""
    
    def __init__(self):
        self.extractor = WindMap_Extractor()
    
    def get_wind_map_data(self, lat, lon, z):
        """Get wind map data for the given coordinates.
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            z (int): Altitude
            
        Returns:
            dict: Wind map data or error message
        """
        logger.info(f"Getting wind map data for coordinates: lat={lat}, lon={lon}, z={z}")
        
        try:
            result = self.extractor.windmap_ingest(lat=lat, lon=lon, z=z)
            return result, 200
        except Exception as e:
            logger.error(f"Error retrieving wind map data: {e}")
            return {"error": f"Failed to retrieve wind map data: {str(e)}"}, 500