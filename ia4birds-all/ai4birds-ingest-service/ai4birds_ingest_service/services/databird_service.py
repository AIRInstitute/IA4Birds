import threading
import asyncio
from ai4birds_ingest_service.log import serve_application_logger
from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor_Async
from ai4birds_ingest_service.model.combination_data import combine_data

logger = serve_application_logger()

class DataBirdService:
    """Service for handling combined bird data operations from eBird and XenoCanto sources."""
    
    def __init__(self):
        self.ebird_extractor = EBird_Extractor()
        
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
            
    def get_combined_data(self):
        """Get combined data from eBird and XenoCanto sources.
        
        Returns:
            dict: Combined results or error message
        """
        logger.info("Starting combined data extraction from eBird and Xeno-Canto.")
        
        # Direct call to eBird
        ebird_data_raw = self.ebird_extractor.ebird_query()
        
        # Call XenoCanto using thread + asyncio
        result = {}
        thread = threading.Thread(target=self._run_async_xenocanto, args=(result,))
        thread.start()
        thread.join()
        xenocanto_data = result.get('data')
        
        # Error validation
        if isinstance(xenocanto_data, dict) and 'error' in xenocanto_data:
            logger.error("Error extracting data from XenoCanto in DataBird: %s", xenocanto_data['error'])
            return xenocanto_data, 500
            
        # Combine data
        if ebird_data_raw and xenocanto_data:
            results = combine_data(data_ebird=ebird_data_raw, data_xenocanto=xenocanto_data)
        else:
            logger.warning("Failed to retrieve data from one or both sources.")
            results = {"error": "Failed to retrieve data from one or both sources."}
            
        logger.info("Combined extraction completed.")
        return results, 200 if 'error' not in results else 500