#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

from . import socketio

from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.windmap_extractor import WindMap_Extractor

"""
Events from socket
"""

# Definimos los eventos con los nombres, a los que el cliente en NODE se debe conectar

@socketio.on('connect')
def handle_conect():
    print('User connect to socket')


@socketio.on('disconnect')
def handle_desconect():
    print('User disconnect from socket')


@socketio.on('windmap')
def handle_windmap(data):
    print('Received windmap event')  # Agrega este mensaje
    # Crear una instancia de WindMap_Extractor
    extractor = WindMap_Extractor()
   
    # Obtener los parámetros latitud, longitud y altitud del mensaje enviado por el cliente
    lat = data.get('lat')
    lon = data.get('lon')
    z = data.get('z')

    try:
        # Verificar que los datos necesarios estén presentes
        if lat is not None and lon is not None and z is not None:
            # Llamar a la función windmap_ingest y capturar la respuesta
            result = extractor.windmap_ingest(lat, lon, z)

            # Enviar la respuesta al cliente
            socketio.emit('windmap_response', result)
        else:
            # Enviar un mensaje de error si faltan datos
            socketio.emit('error', {'message': 'Missing latitude, longitude, or altitude data'})

    except Exception as e:
        logger.info(f'Error handled windmap: {e}')

    
    