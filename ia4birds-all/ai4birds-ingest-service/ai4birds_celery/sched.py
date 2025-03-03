from app import celery
from celery.schedules import crontab

from tasks import extract
import sys

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

