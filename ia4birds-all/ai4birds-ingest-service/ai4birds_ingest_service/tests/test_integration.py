
import pytest
import time
import json
import base64

from ai4birds_ingest_service.model.db import PostgresSingleton

def load_test_data():
    with open('test_data/test_data.json', 'r') as file:
        return json.load(file)

test_data = load_test_data()


@pytest.mark.parametrize("test_payload", test_data['segment_data'])
def test_segment_data(mqtt_client, test_payload):

    mqtt_client.publish("a4birds/cam/segment", json.dumps(test_payload))
    time.sleep(5)

    db = PostgresSingleton.getInstance()
    db.connect()
    db.execute("SELECT * FROM segment_data WHERE camera_id = %s ORDER BY id DESC LIMIT 1", ("CAM123",))
    row = db.fetchone()
    db.close()

    assert row is not None
    assert row[1] == "CAM123"  # camera
    assert row[2] == 1         # segment_idx


@pytest.mark.parametrize("test_payload", test_data['heatmap_data'])
def test_heatmap_data(mqtt_client, test_payload):
 
    mqtt_client.publish("a4birds/cam/heatmap", json.dumps(test_payload))
    time.sleep(5)

    db = PostgresSingleton.getInstance()
    db.connect()
    db.execute("SELECT * FROM heatmap_image WHERE camera_id = %s ORDER BY id DESC LIMIT 1", ("CAM456",))
    row = db.fetchone()
    db.close()

    assert row is not None
    assert row[1] == "CAM456"  # camera
    assert row[2] == "az30-60"
    assert isinstance(row[3], str)  # image_url
