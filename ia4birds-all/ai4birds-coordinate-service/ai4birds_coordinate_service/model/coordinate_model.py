import requests
import json

from ai4birds_coordinate_service import config, logger

class CheckModel:

    def get(self, id: int):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/crud/'
        headers = {'Content-Type': 'application/json'}
        try:
            response = requests.get(url, headers=headers, params={'id': id})
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
        
            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500


    def post(self, data: dict):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/crud/'
        headers = {'Content-Type': 'application/json'}
        
        try:
            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
            
            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500

    def put(self, id: int, data:dict):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/crud/'
        headers = {'Content-Type': 'application/json'}

        try:
            response = requests.put(url, headers=headers, params={'id': id}, json=data)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
            
            else:
                return {"status": "Not found"}, 404

        except Exception as e:
            return {"status": f"Server Error {e}"}, 500


    def delete(self, id: int):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/crud/'
        headers = {'Content-Type': 'application/json'}

        try:
            response = requests.delete(url, headers=headers, params={'id': id})
            if response.status_code == 200:
                response = json.loads(response.content)
                return response
            
            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500


class EBird:
    def get(self):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/ebird/'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response 

            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500

class XenoCanto:
    def get(self):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/xenocanto/'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response 

            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500

class ExclusionMap:
    def get(self):
        url = 'http://localhost:5001/ai4birds-ingest-service/v1/exclusionmap/'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                response = json.loads(response.content)
                return response 

            else:
                return {"status": "Not found"}, 404
        
        except Exception as e:
            return {"status": f"Server Error {e}"}, 500