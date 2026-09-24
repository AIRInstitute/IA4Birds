from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor

logger = serve_application_logger()

class EBirdService:
    """Service for handling eBird data operations."""
    
    def __init__(self):
        self.extractor = EBird_Extractor()
    
    def get_ebird_data(self):
        """Get data from eBird.

        Does not persist: storage is done only by the Celery task
        (ai4birds_celery.tasks.ebird_extract) to avoid duplicating rows
        on every request.

        Returns:
            tuple: Data and status code
        """
        logger.info("Starting data extraction from eBird.")

        data = self.extractor.ebird_query()

        return data or {"error": "No data retrieved from eBird API"}, 200 if data else 404
