#!/bin/sh

# Ejecutamos el worker de Celery
celery -A tasks worker --loglevel=info &

# Ejecutamos el beat de Celery
# TODO

# Esperamos a que termine el worker
wait

