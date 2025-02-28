from celery import Celery
from celery.schedules import crontab
from os import environ

# Aplicación de Celery utilizando el broker de redis
# (que se encuentra en el contenedor llamado "redis")
REDIS_HOST = environ.get("REDIS_HOST", "redis");
REDIS_PASSWORD = environ.get("REDIS_PASSWORD");
celery = Celery(
    'XenoCantoEBirdExtractor',
    broker=f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0",
)

celery.conf.update(
    task_serializer = 'json',
    timezone = 'UTC',
    beat_schedule = {
        'Extraer datos de eBird y Xenocanto': {
            'task': 'ai4birds_celery.app.extract',
            'schedule': crontab(minute='0', hour='2', day_of_month='1'),
        }
    },
)

from ai4birds_ingest_service.model.extractor.ebird_extractor import EBird_Extractor
from ai4birds_ingest_service.model.ebird.ebird_model import EBirdModel
from ai4birds_ingest_service.model.ebird.ebird_data import EBirdData

from ai4birds_ingest_service.model.extractor.xenocanto_extractor import XenoCanto_Extractor 
from ai4birds_ingest_service.model.xenocanto.xenocanto_model import XenoCantoModel
from ai4birds_ingest_service.model.xenocanto.xenocanto_data import XenoCantoData

from ai4birds_ingest_service.log import logger

# Extraer datos de eBird y Xenocanto
@celery.task
def extract():
    try:
        ebird_extract();
        xenocanto_extract();
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
    xc_extractor = XenoCanto_Extractor()
    xc_model = XenoCantoModel()

    logger.info("Fetching Xenocanto data...")
    data = xc_extractor.xenocanto_query()
    if data:
        xc_model.add_batch([XenoCantoData.from_dict(item) for item in data])
        logger.info("Successfully stored Xenocanto data in the database.")
    else:
        logger.warning("No data found in Xenocanto API.")

