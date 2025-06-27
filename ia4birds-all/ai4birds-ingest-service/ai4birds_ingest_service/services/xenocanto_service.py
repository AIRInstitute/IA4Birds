import threading
import asyncio
from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor_Async
from ai4birds_ingest_service.model.xenocanto.xenocanto_model import XenoCantoModel, XenoCantoData

logger = serve_application_logger()

class XenoCantoService:
    """Service for handling XenoCanto data operations."""
    
    def _run_async_xenocanto(self, result_dict):
        """Run XenoCanto extraction in a separate thread with its own event loop."""
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            extractor = XenoCanto_Extractor_Async()
            result_dict['data'] = loop.run_until_complete(extractor.xenocanto_query())
            loop.close()
        except Exception as e:
            logger.error(f"Error executing asynchronous extraction: {e}")
            result_dict['data'] = {"error": str(e)}
            
    def get_xenocanto_data(self):
        """Get data from XenoCanto and store it in database.
        
        Returns:
            tuple: Data and status code
        """
        logger.info("Starting data extraction from Xeno-Canto.")
        
        result = {}
        thread = threading.Thread(target=self._run_async_xenocanto, args=(result,))
        thread.start()
        thread.join()
        
        data = result.get('data')
        
        if isinstance(data, dict) and 'error' in data:
            logger.error("Error extracting data from XenoCanto: %s", data['error'])
            return data, 500
        
        # Save to database if data was retrieved
        try:
            if data:
                logger.info("Saving data to database...")
                model = XenoCantoModel()
                objects = [XenoCantoData.from_dict(item) for item in data]
                model.add_batch(objects)
                logger.info("Data saved successfully.")
        except Exception as e:
            logger.error(f"Error saving XenoCanto data to database: {e}")
            return {"error": "Error saving to database."}, 500
            
        logger.info(f"Extraction completed. Total species obtained: {len(data)}")
        return data, 200