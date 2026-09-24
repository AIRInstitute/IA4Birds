import asyncio

from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.ebird.ebird_model import EBirdModel
from ai4birds_ingest_service.model.ebird.ebird_data import EBirdData

from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor_Async 
from ai4birds_ingest_service.model.xenocanto.xenocanto_model import XenoCantoModel
from ai4birds_ingest_service.model.xenocanto.xenocanto_data import XenoCantoData

from ai4birds_ingest_service.log import logger

from .app import celery

# Extraer datos de eBird y Xenocanto
@celery.task(name='ai4birds_celery.tasks.extract')
def extract():
    # Cada fuente por separado: un fallo en eBird no debe impedir la de Xenocanto
    for extractor in (ebird_extract, xenocanto_extract):
        try:
            extractor()
        except Exception as e:
            logger.error(f"Error in task {extractor.__name__}: {e}")
    
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
    # El loop debe existir antes de crear el extractor: en Python 3.8 su
    # asyncio.Semaphore se asocia al loop activo al instanciarse
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        xc_extractor = XenoCanto_Extractor_Async()
        xc_model = XenoCantoModel()

        logger.info("Fetching Xenocanto data...")
        data = loop.run_until_complete(xc_extractor.xenocanto_query())
    finally:
        loop.close()
        asyncio.set_event_loop(None)
    if data:
        xc_model.add_batch([XenoCantoData.from_dict(item) for item in data])
        logger.info("Successfully stored Xenocanto data in the database.")
    else:
        logger.warning("No data found in Xenocanto API.")
