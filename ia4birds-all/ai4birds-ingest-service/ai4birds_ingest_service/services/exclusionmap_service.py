import requests
import time
from ai4birds_ingest_service import config
from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.data_services.csv_to_json_service import CSVToJsonService
from ai4birds_ingest_service.model.data_services.csv_streamer import CSVStreamer
from ai4birds_ingest_service.model.data_services.zip_generator import ZipGenerator

logger = serve_application_logger()

class ExclusionMapService:
    """Service for handling exclusion map data operations."""
    
    def __init__(self):
        self.csv_service = CSVToJsonService()
        self.csv_streamer = CSVStreamer()
    
    def get_paginated_data(self, page, page_size):
        """Get paginated exclusion map data.
        
        Args:
            page (int): Page number
            page_size (int): Items per page
            
        Returns:
            tuple: Data and status code
        """
        logger.info(f"Getting paginated exclusion map data: page={page}, page_size={page_size}")
        
        try:
            data = self.csv_service.convert(config.EXCLUSION_EOLICA_CSV_PATH, page=page, page_size=page_size)
            if not data['data']:
                logger.warning("No data found for the specified page parameters")
                return {"message": "Data not found for the specified page parameters"}, 404
            return data, 200
        except Exception as e:
            logger.error(f"Error retrieving paginated exclusion map data: {e}")
            return {'error': str(e)}, 500
    
    def get_all_data(self):
        """Get all exclusion map data.
        
        Returns:
            tuple: Data and status code
        """
        logger.info("Getting all exclusion map data")
        
        try:
            data = self.csv_service.convert(config.EXCLUSION_EOLICA_CSV_PATH, page=1, page_size=10**6)
            return {'data': data['data']}, 200
        except Exception as e:
            logger.error(f"Error retrieving all exclusion map data: {e}")
            return {'error': str(e)}, 500
    
    def get_zip_data(self):
        """Get exclusion map data as ZIP file.
        
        Returns:
            tuple: ZIP file path and status code
        """
        logger.info("Generating ZIP file with exclusion map data")
        
        try:
            data = self.csv_service.convert(config.EXCLUSION_EOLICA_CSV_PATH, page=1, page_size=10**6)
            zip_path = ZipGenerator.json_to_zip(data)
            return zip_path, 200
        except Exception as e:
            logger.error(f"Error generating ZIP with exclusion map data: {e}")
            return None, 500
    
    def stream_data(self, client_id):
        """Stream exclusion map data to remote backend.
        
        Args:
            client_id (str): Client identifier
            
        Returns:
            tuple: Result message and status code
        """
        logger.info(f"Streaming exclusion map data for client_id={client_id}")
        
        try:
            URL = f'http://{config.BACKEND_URL}/api/data/exclusionmap/stream-exclusion-data?client_id={client_id}'
            
            for batch in self.csv_streamer.stream(config.EXCLUSION_EOLICA_CSV_PATH):
                response = requests.post(URL, json=batch)
                if response.status_code != 200:
                    logger.warning(f"Failed to send batch: {response.status_code}")
                time.sleep(1)
                
            return {"message": "Data streaming completed."}, 200
        except Exception as e:
            logger.error(f"Error streaming exclusion map data: {e}")
            return {'error': str(e)}, 500