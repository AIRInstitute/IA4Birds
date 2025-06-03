import pytest
import requests

testdata_windmap = [
    {"lat": 41.85563222906876, "lon": -5.5495918821608665, "z": 50},
    # Puedes añadir más diccionarios con otros casos
]

class TestApi:
    def test_XenoCanto(self):
        url = 'http://localhost:5000/ai4birds-ingest-service/v1/xenocanto/'
        response = requests.get(url)
        assert response.status_code == 200

    def test_eBird(self):
        url = 'http://localhost:5000/ai4birds-ingest-service/v1/ebird/'
        response = requests.get(url)
        assert response.status_code == 200

    @pytest.mark.parametrize("data", testdata_windmap)
    def test_windmap(self, data):
        url = 'http://localhost:5000/ai4birds-ingest-service/v1/windmap'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, json=data, headers=headers)
        assert response.status_code == 200

    def test_exclusionmap(self):
        url = 'http://localhost:5000/ai4birds-ingest-service/v1/exclusionmap/'
        response = requests.get(url)
        assert response.status_code == 200
