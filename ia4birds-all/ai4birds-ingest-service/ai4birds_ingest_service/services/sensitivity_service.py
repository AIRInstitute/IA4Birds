from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.data_services.csv_to_json_service import CSVToJsonService

logger = serve_application_logger()

class SensitivityService:
    """Service for handling bird sensitivity data operations."""
    
    def __init__(self):
        self.csv_service = CSVToJsonService()
    
    def get_sensitivity_data(self):
        """Get all bird sensitivity data.
        
        Returns:
            tuple: Data and status code
        """
        logger.info("Getting bird sensitivity data")
        
        try:
            data = self.csv_service.convert(config.CORRDENADAS_CSV_PATH, page=1, page_size=10**6)
            return {'data': data['data']}, 200
        except Exception as e:
            logger.error(f"Error retrieving sensitivity data: {e}")
            return {'error': str(e)}, 500