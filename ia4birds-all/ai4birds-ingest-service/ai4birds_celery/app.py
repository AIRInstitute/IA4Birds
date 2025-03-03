from celery import Celery
from celery.schedules import crontab
from os import environ
import sys

# Aplicación de Celery utilizando el broker de redis
# (que se encuentra en el contenedor llamado "redis")
REDIS_HOST = environ.get("REDIS_HOST", "redis");
REDIS_PASSWORD = environ.get("REDIS_PASSWORD");
celery = Celery(
    'XenoCantoEBirdExtractor',
    broker=f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:6379/0",
    include=['ai4birds_celery.tasks']
)

celery.conf.update(
    task_serializer = 'json',
    timezone = 'UTC',
    beat_schedule = {
        'Extraer datos de eBird y Xenocanto': {
            'task': 'ai4birds_celery.tasks.extract',
            'schedule': crontab(),
        }
    },
)

if __name__ == '__main__':
    args = sys.argv[1:]

    if len(args) > 0:
            command = args[0]
            remaining_args = args[1:]
            
            if command == 'worker':
                # For worker mode
                celery.worker_main(['worker'] + remaining_args)
            elif command == 'beat':
                # For beat mode
                celery.Beat(app=celery).run()
            else:
                print(f"Unknown command: {command}")
                sys.exit(1)
    else:
        print("No command specified. Use 'worker' or 'beat'.")
        sys.exit(1)

