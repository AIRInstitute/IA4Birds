#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

from . import socketio

from ai4birds_ingest_service import logger
from ai4birds_ingest_service.model.extractor.windmap_extractor import WindMap_Extractor

"""
Events from socket
"""

# Define the events with the names to which the Node.js client should connect
@socketio.on('connect')
def handle_conect():
    print('User connect to socket')


@socketio.on('disconnect')
def handle_desconect():
    print('User disconnect from socket')


@socketio.on('windmap')
def handle_windmap(data):
    print('Received windmap event')  # Add this message
    
    # Crear una instancia de WindMap_Extractor
    extractor = WindMap_Extractor()
   
    # Obtener los parámetros latitud, longitud y altitud del mensaje enviado por el cliente
    lat = data.get('lat')
    lon = data.get('lon')
    z = data.get('z')

    try:
        # Verify that the required data is present
        if lat is not None and lon is not None and z is not None:
            # Call the windmap_ingest method and capture the response
            result = extractor.windmap_ingest(lat, lon, z)

            # Send the response to the client
            socketio.emit('windmap_response', result)
        else:
            # Send an error message if data is missing
            socketio.emit('error', {'message': 'Missing latitude, longitude, or altitude data'})

    except Exception as e:
        logger.info(f'Error handled windmap: {e}')

    
    