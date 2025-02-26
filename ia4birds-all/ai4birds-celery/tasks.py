from celery import Celery
from os import environ

# Aplicación de Celery utilizando el broker de redis
# (que se encuentra en el contenedor llamado "redis")
REDIS_HOST = environ.get("REDIS_HOST", "redis");
REDIS_PASSWORD = environ.get("REDIS_PASSWORD");
app = Celery('tasks', broker=f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0")
