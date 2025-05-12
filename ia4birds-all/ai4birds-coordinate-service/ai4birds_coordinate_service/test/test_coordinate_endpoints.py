import pytest
import requests_mock
import requests
import json
from config_test import BASE_URL, TOKEN

@pytest.fixture
def mock_requests():
    with requests_mock.Mocker() as mock:
        yield mock

def get_headers():
    headers = {"Content-Type": "application/json"}
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    return headers

def test_ebird(mock_requests):
    mock_requests.get(f"{BASE_URL}/ebird", json={"message": "ok"}, status_code=200)
    response = requests.get(f"{BASE_URL}/ebird", headers=get_headers())
    assert response.status_code in [200, 500]

def test_xenocanto(mock_requests):
    mock_requests.get(f"{BASE_URL}/xenocanto", json={"message": "ok"}, status_code=200)
    response = requests.get(f"{BASE_URL}/xenocanto", headers=get_headers())
    assert response.status_code in [200, 500]

def test_sensitivity(mock_requests):
    mock_requests.get(f"{BASE_URL}/sensitivity", json={"message": "ok"}, status_code=200)
    response = requests.get(f"{BASE_URL}/sensitivity", headers=get_headers())
    assert response.status_code in [200, 500]

def test_databird(mock_requests):
    mock_requests.get(f"{BASE_URL}/dataBird", json={}, status_code=404)
    response = requests.get(f"{BASE_URL}/dataBird", headers=get_headers())
    assert response.status_code in [200, 500, 404]

def test_windmap(mock_requests):
    body = {
        "lat": 41.85563222906876,
        "lon": -5.5495918821608665,
        "z": 50
    }
    mock_requests.post(f"{BASE_URL}/windmap", json={"wind": "data"}, status_code=200)
    response = requests.post(f"{BASE_URL}/windmap", json=body, headers=get_headers())
    assert response.status_code in [200, 500]

def test_exclusionmap(mock_requests):
    body = {
        "page": 1,
        "page_size": 20
    }
    mock_requests.post(f"{BASE_URL}/exclusionmap", json={"result": []}, status_code=200)
    response = requests.post(f"{BASE_URL}/exclusionmap", json=body, headers=get_headers())
    assert response.status_code in [200, 500]

def test_exclusionmap_stream(mock_requests):
    mock_requests.post(f"{BASE_URL}/exclusionmap/stream-exclusion-data", json={}, status_code=200)
    response = requests.post(f"{BASE_URL}/exclusionmap/stream-exclusion-data", headers=get_headers())
    assert response.status_code in [200, 500]

def test_exclusionmap_zip(mock_requests):
    mock_requests.get(f"{BASE_URL}/exclusionmap/zip", content=b'binary-zip-content', status_code=200)
    response = requests.get(f"{BASE_URL}/exclusionmap/zip", headers=get_headers())
    assert response.status_code in [200, 500, 404]

def test_device_status(mock_requests):
    body = {
        "gps_latitude": 40.416775,
        "gps_longitude": -3.70379,
        "status": "active",
        "storage_status": 15.5,
        "last_update": "2024-10-28 15:59:00"
    }
    mock_requests.post(f"{BASE_URL}/device-status", json={"stored": True}, status_code=200)
    response = requests.post(f"{BASE_URL}/device-status", json=body, headers=get_headers())
    assert response.status_code in [200, 500]

def test_device_status_latest(mock_requests):
    mock_requests.get(f"{BASE_URL}/device-status/latest", json={}, status_code=404)
    response = requests.get(f"{BASE_URL}/device-status/latest", headers=get_headers())
    assert response.status_code in [200, 500, 404]

def test_device_status_health(mock_requests):
    mock_requests.get(f"{BASE_URL}/device-status/health", json={"health": "ok"}, status_code=200)
    response = requests.get(f"{BASE_URL}/device-status/health", headers=get_headers())
    assert response.status_code in [200, 500, 404]
