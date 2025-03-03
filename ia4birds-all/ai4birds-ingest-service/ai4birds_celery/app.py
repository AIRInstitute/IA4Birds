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
    include=['ai4birds_celery.tasks']
)
