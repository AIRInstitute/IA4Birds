
import pytest
import paho.mqtt.client as mqtt

from ai4birds_ingest_service.model.db import PostgresSingleton
from ai4birds_ingest_service.run import app as flask_app

@pytest.fixture(scope='session')
def app():
    yield flask_app

@pytest.fixture(scope='session')
def client(app):
    return app.test_client()

@pytest.fixture(scope='session')
def mqtt_client():
    client = mqtt.Client()
    client.connect("broker.hivemq.com", 1883, 60)
    client.loop_start()

    yield client

    client.loop_stop()
    client.disconnect()

@pytest.fixture(autouse=True)
def cleanup_db():
    yield
    db = PostgresSingleton.getInstance()
    db.connect()
    db.execute("DELETE FROM segment_data WHERE camera_id = 'CAM123'")
    db.execute("DELETE FROM heatmap_image WHERE camera_id = 'CAM456'")
    db.close()