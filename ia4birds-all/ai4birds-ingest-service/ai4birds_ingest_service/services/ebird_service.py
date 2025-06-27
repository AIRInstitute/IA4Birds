from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.ebird.ebird_model import EBirdModel, EBirdData

logger = serve_application_logger()

class EBirdService:
    """Service for handling eBird data operations."""
    
    def __init__(self):
        self.extractor = EBird_Extractor()
    
    def get_ebird_data(self):
        """Get data from eBird and store it in database.
        
        Returns:
            tuple: Data and status code
        """
        logger.info("Starting data extraction from eBird.")
        
        data = self.extractor.ebird_query()
        
        # Save to database if data was retrieved
        try:
            if data:
                logger.info("Saving data to database...")
                model = EBirdModel()
                objects = [EBirdData.from_dict(item) for item in data]
                model.add_batch(objects)
                logger.info("Data saved successfully.")
        except Exception as e:
            logger.error(f"Error saving eBird data to database: {e}")
            return {"error": "Error saving to database."}, 500
            
        return data or {"error": "No data retrieved from eBird API"}, 200 if data else 404