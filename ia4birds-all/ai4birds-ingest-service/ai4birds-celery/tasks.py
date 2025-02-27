from app import celery

# Extraer datos de eBird y Xenocanto
@celery.task
def extract():
    print("Extrayendo datos de eBird y Xenocanto", flush=True)
