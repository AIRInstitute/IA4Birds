from celery import Celery
from celery.schedules import crontab
from os import environ

# Aplicación de Celery utilizando el broker de redis
# (que se encuentra en el contenedor llamado "redis")
REDIS_HOST = environ.get("REDIS_HOST", "redis");
REDIS_PASSWORD = environ.get("REDIS_PASSWORD");
app = Celery(
    'tasks',
    broker=f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0",
)

# Configuramos la tarea para que se ejecute una vez al mes
@app.on_after_configure.connect # type: ignore 
def setup_task(sender: Celery, **kwargs):
    sender.add_periodic_task(
        crontab(minute='0', hour='2', day_of_month='1'),
        sig=task.s(), # type: ignore
        name='Ejecutar tarea'
    )

# Task a ejecutar 
@app.task
def task():
    ...
