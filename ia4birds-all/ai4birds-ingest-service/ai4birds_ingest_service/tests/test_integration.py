
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

    iamge_path = "../heatmaps/heatmap.png"
    with open(iamge_path, 'rb') as image_file:
        image_data = image_file.read()
 
    mqtt_client.publish("a4birds/cam/heatmap/metadata/CAM456", json.dumps(test_payload))
    mqtt_client.publish("a4birds/cam/heatmap/image/CAM456", image_data)
    time.sleep(5)

    db = PostgresSingleton.getInstance()
    db.connect()
    db.execute("SELECT * FROM heatmap_image WHERE camera_id = %s ORDER BY id DESC LIMIT 1", ('CAM456',))
    row = db.fetchone()
    db.close()

    assert row is not None
    assert row[1] == "CAM456"  # camera
    assert row[2] == "az30-60"
    assert isinstance(row[3], str)  # image_url


@pytest.mark.parametrize("test_payload", test_data['segment_data'])
def test_bird_statistics_update(mqtt_client, test_payload):

    mqtt_client.publish("a4birds/cam/segment", json.dumps(test_payload))
    time.sleep(5)

    db = PostgresSingleton.getInstance()
    db.connect()

    camera_id = test_payload["camera_id"]
    frames = test_payload["frames"]

    bird_names_detected = set()
    for detections in frames.values():
        for detection in detections:
            distances = detection.get('distances', {})
            for bird_name in distances.keys():
                bird_names_detected.add(bird_name)
    
    for bird_name in bird_names_detected:
        db.execute(
            "SELECT * FROM bird_statistics WHERE camera_id = %s AND bird_name = %s ORDER BY last_seen DESC LIMIT 1", 
            (camera_id, bird_name)
        )

        row = db.fetchone()
        assert row is not None, f'No bird statistics found for camera_id: {camera_id} and bird_name: {bird_name}'
        assert row[1] == camera_id  # camera
        assert row[2] == bird_name  # bird_name
        assert row[3] >= 1         # count
    
    db.close()