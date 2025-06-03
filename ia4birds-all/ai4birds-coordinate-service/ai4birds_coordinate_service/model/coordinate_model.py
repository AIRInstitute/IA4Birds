import requests
import json
from ai4birds_coordinate_service import config, logger

class CheckModel:
    HEADERS = {'Content-Type': 'application/json'}
    def get(self, id: int):
        try:
            response = requests.get(config.CRUD_URL, headers=self.HEADERS, params={'id': id})
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
        
            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500


    def post(self, data: dict):
        try:
            response = requests.post(config.CRUD_URL, headers=self.HEADERS, json=data)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response

            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500

    def put(self, id: int, data:dict):
        try:
            response = requests.put(config.CRUD_URL, headers=self.HEADERS, params={'id': id}, json=data)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
            
            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500


    def delete(self, id: int):
        try:
            response = requests.delete(config.CRUD_URL, headers=self.HEADERS, params={'id': id})
            if response.status_code == 200:
                response = json.loads(response.content)
                return response

            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500


class EBird:
    @staticmethod
    def get():
        try:
            response = requests.get(config.EBIRD_URL)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response 

            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500

class XenoCanto:
    @staticmethod
    def get():
        try:
            response = requests.get(config.XENOCANTO_URL)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response 

            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500

class WindMap:
    @staticmethod
    def get(lat: float, lon: float, z: int):
        headers = {'Content-Type': 'application/json'}

        try:
            response = requests.get(config.WINDMAP_URL, headers=headers, params={'lat': lat, 'lon': lon, 'z': z})
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
            
            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500



class ExclusionMap:
    @staticmethod
    def get():
        try:
            response = requests.get(config.EXCLUSIONMAP_URL)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response 

            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500