#!/bin/sh

# Ejecutamos el worker de Celery
celery -A tasks worker --loglevel=info &

# Ejecutamos el beat de Celery
celery -A tasks beat --loglevel=info &

# Esperamos a que termine todo 
wait

