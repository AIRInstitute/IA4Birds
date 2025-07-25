#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import json
from datetime import datetime

#from flask_socketio import SocketIO
from typing import Any, Dict

from flask import Flask, Blueprint, redirect, request
from flask_cors import CORS
from flask_mqtt import Mqtt

# from flask_caching import Cache
from ai4birds_ingest_service import config, logger
#from ai4birds_ingest_service import events
from ai4birds_ingest_service.api.v1 import api
from ai4birds_ingest_service.api import namespaces
from ai4birds_ingest_service.core import cache, limiter

from ai4birds_ingest_service.model.data_segment.data_segment import DataSegment
from ai4birds_ingest_service.model.data_segment.data_segment_model import DataSegmentModel
from ai4birds_ingest_service.model.data_heatmap.data_heatmap import DataHeatmap
from ai4birds_ingest_service.model.data_heatmap.data_heatmap_model import DataHeatmapModel
from ai4birds_ingest_service.model.bird_statistics.bird_statistics_model import BirdStatisticsModel


from . import socketio

app = Flask(__name__)
app.config['MQTT_BROKER_URL'] = config.MQTT_BROKER
app.config['MQTT_BROKER_PORT'] = config.MQTT_PORT
app.config['MQTT_KEEPALIVE'] = config.MQTT_KEEPALIVE
app.config['MQTT_TLS_ENABLED'] = config.MQTT_TLS_ENABLED
app.config['TIME_WITHOUT_MESSAGE'] = config.TIME_WITHOUT_MESSAGE

mqtt = Mqtt(app)

#models
data_segment = DataSegmentModel()
data_heatmap = DataHeatmapModel()
bird_statistics = BirdStatisticsModel()

heatmap_buffer = {}

# socketio = SocketIO(app)

VERSION = (1, 0)
AUTHOR = 'AIRInstitute'


def get_version():
    """
    This function returns the API version that is being used.
    """

    return '.'.join(map(str, VERSION))


def get_authors():
    """
    This function returns the API's author name.
    """

    return str(AUTHOR)


__version__ = get_version()
__author__ = get_authors()
    

@app.route('/')
def register_redirection():
    """
    Redirects to dcoumentation page.
    """

    return redirect(f'{request.url_root}/{config.URL_PREFIX}', code=302)


@mqtt.on_connect()
def handle_connect(client, userdata:Any, flags: Dict[str, Any], rc: int):
    """
    This function is called when the client connects to the MQTT broker.
    """
    logger.info(f'Connected to MQTT broker: {config.MQTT_BROKER}, with result code: {rc}')
    topics = [
        config.A4BIRDS_CAMERA_SEGMENT,
        config.A4BIRDS_CAMERA_HEATMAP_METADATA,
        config.A4BIRDS_CAMERA_HEATMAP_IMAGE
    ]

    for topic in topics:
        mqtt.subscribe(topic)
        logger.info(f'Subscribed to topic: {topic}')


@mqtt.on_disconnect()
def handle_disconnect(client, userdata, rc):
    logger.warning(f'Disconnected from MQTT broker with result code: {rc}')
    # Attempt to reconnect
    mqtt.connect()


@mqtt.on_message()
def handle_message(client, userdata:Any, msg:Any):
    """
    This function is called when a message is received from the MQTT broker.
    """
    topic = msg.topic
    heatmap_id = topic.split('/')[-1]
    logger.info(f'Received message from topic: {topic}')

    try:
        if topic == config.A4BIRDS_CAMERA_SEGMENT:
            try:
                payload = msg.payload.decode('utf-8')
                json_data = json.loads(payload)
                obj = DataSegment.from_dict(json_data)

                if obj:
                    data_segment.add(obj)
                    bird_statistics.process_statistics(obj)

                else:
                    logger.warning(f'Failed to create DataSegment object from payload.')
            except Exception as e:
                logger.error(f'Error handling segment: {e}')
            return

        elif topic.startswith(config.A4BIRDS_CAMERA_HEATMAP_METADATA_PREFIX):
            try:
                payload = msg.payload.decode('utf-8')
                json_data = json.loads(payload)

                heatmap_buffer.setdefault(heatmap_id, {})["metadata"] = json_data
                heatmap_buffer[heatmap_id]["time"] = datetime.now()
            except Exception as e:
                logger.error(f'Error handling heatmap metadata: {e}')
                return
    
        elif topic.startswith(config.A4BIRDS_CAMERA_HEATMAP_IMAGE_PREFIX):
            try:

                image_bytes = msg.payload
                
                heatmap_buffer.setdefault(heatmap_id, {})["image"] = image_bytes
                heatmap_buffer[heatmap_id]["time"] = datetime.now()
            except Exception as e:
                logger.error(f'Error handling heatmap image: {e}')
                return

        else:
            logger.warning(f"No handler found for topic: {topic}")


        buffer = heatmap_buffer.get(heatmap_id, {})
        if "metadata" in buffer and "image" in buffer:
            try:
                heatmap_data = buffer["metadata"]
                heatmap_image = buffer["image"]
                obj = DataHeatmap.from_dict(heatmap_data, heatmap_image)
                if obj:
                    data_heatmap.add(obj)
                else:
                    logger.warning(f'Failed to create DataHeatmap object from payload.')
            except Exception as e:
                logger.error(f'Error handling heatmap data: {e}')
                return
            finally:
                del heatmap_buffer[heatmap_id]

    except Exception as e:
        logger.error(f'Error handling message: {e}')


def initialize_app(flask_app):
    """
    This function initializes the Flask Application, adds the namespace and registers the blueprint.
    """
    CORS(flask_app)

    v1 = Blueprint('api', __name__, url_prefix=config.URL_PREFIX)
    api.init_app(v1)

    limiter.exempt(v1)

    cache.init_app(flask_app)

    for ns in namespaces:
        api.add_namespace(ns)
    
    flask_app.register_blueprint(v1)
    flask_app.config.from_object(config)


def main():
    initialize_app(app)
    separator_str = ''.join(map(str, ["=" for i in range(175)]))
    print(separator_str)
    print(f'Debug mode: {config.DEBUG_MODE}')
    print(f'Authors: {get_authors()}')
    print(f'Version: {get_version()}')
    print(f'Base URL: http://localhost:{config.PORT}{config.URL_PREFIX}')
    print(f'Socket URL: http://localhost:{config.PORT}')
    print(separator_str)
    
    # Inicializar SocketIO con la aplicación Flask cors_allowed_origins="*"
    socketio.init_app(app)
    
    # Ejecutar la aplicación con SocketIO
    socketio.run(app, host=config.HOST, port=config.PORT, debug=config.DEBUG_MODE, allow_unsafe_werkzeug=True)
    print(f'Ejecutado socket')

if __name__ == '__main__':
    main()