import requests
import pytest

testdata_windmap = [
    (41.85563222906876, -5.5495918821608665, 50),
    # Agrega más conjuntos de datos según sea necesario
]

class TestApi:
    def test_XenoCanto(self):
        response = requests.get('http://localhost:5000/ai4birds-ingest-service/v1/xenocanto/')
        assert response.status_code == 200

    def test_eBird(self):
        response = requests.get('http://localhost:5000/ai4birds-ingest-service/v1/ebird/')
        assert response.status_code == 200

    @pytest.mark.parametrize("lat, lon, z", testdata_windmap)
    def test_windmap(self, lat:float, lon:float, z:int):
        url = 'http://localhost:5000/ai4birds-ingest-service/v1/windmap /windMap'
        data = {
            'lat': lat,
            'lon': lon,
            'z': z
        }
        headers = {'Content-Type': 'application/json'}

        response = requests.post(url, json=data, headers=headers)
        assert response.status_code == 200

    def test_exclusionmap(self):
        response = requests.get('http://localhost:5000/ai4birds-ingest-service/v1/exclusionmap/')
        assert response.status_code == 200