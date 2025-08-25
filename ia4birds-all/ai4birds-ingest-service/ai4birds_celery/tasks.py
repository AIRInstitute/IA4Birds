from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.ebird.ebird_model import EBirdModel
from ai4birds_ingest_service.model.ebird.ebird_data import EBirdData

from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor_Async 
from ai4birds_ingest_service.model.xenocanto.xenocanto_model import XenoCantoModel
from ai4birds_ingest_service.model.xenocanto.xenocanto_data import XenoCantoData

from ai4birds_ingest_service.log import logger
import asyncio

from .app import celery

# Extraer datos de eBird y Xenocanto
@celery.task(name='ai4birds_celery.tasks.extract')
def extract():
    try:
        ebird_extract()
        xenocanto_extract()
    except Exception as e:
        logger.error(f"Error in task: {e}")
    
def ebird_extract() -> None:
    eb_extractor = EBird_Extractor()
    eb_model = EBirdModel() 

    logger.info("Fetching eBird data...")
    data = eb_extractor.ebird_query()
    if data:
        eb_model.add_batch([EBirdData.from_dict(item) for item in data])
        logger.info("Successfully stored eBird data in the database.")
    else:
        logger.warning("No data found in eBird API.")

def xenocanto_extract() -> None:
    xc_extractor = XenoCanto_Extractor_Async()
    xc_model = XenoCantoModel()

    logger.info("Fetching Xenocanto data...")
    # Execute the async function properly
    data = asyncio.run(xc_extractor.xenocanto_query())
    if data:
        xc_model.add_batch([XenoCantoData.from_dict(item) for item in data])
        logger.info("Successfully stored Xenocanto data in the database.")
    else:
        logger.warning("No data found in Xenocanto API.")
