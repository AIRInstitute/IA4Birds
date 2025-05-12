#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
from flask import Blueprint, request, jsonify
import requests
#from auth.decorators import require_role
from ...utils.decorators import require_token
from ai4birds_coordinate_service import config
from flask_restx import Namespace, Resource
from ai4birds_coordinate_service.log import serve_application_logger

coordinate_ns = Namespace("coordinate", description="Coordinate API Gateway")
logger = serve_application_logger()
# -------------------- ENDPOINT PRIVADOS --------------------

@coordinate_ns.route("/ebird")
class EBird(Resource):
    @require_token()
    def get(self):
        """
        Retrieves bird observation data from the eBird API in Castilla y León.

        This endpoint acts as a proxy to the `/ebird/` endpoint in the ingestion API (`ai4birds-ingest-service`).

        Authentication:
            This endpoint is private and requires a valid JWT access token in the `Authorization` header.

        Returns:
            :return: Data from the eBird ingestion service.
            :rtype: dict
        """

        try:
            response = requests.get(f"{config.URL_INGEST}/ebird/")

            if response.status_code != 200:
                response.raise_for_status()

            data = response.json()
            return data, 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[eBird] Error response: {response.status_code} - {response.text}")
            return {"error": f"Failed to fetch eBird data: {error_message}"}, response.status_code

        except requests.exceptions.RequestException as e:
            logger.error(f"[eBird] Exception during request: {e}")
            return {"error": "Failed to contact ingestion API for eBird."}, 500

        except ValueError as e:
            logger.error(f"[eBird] Invalid JSON response: {e}")
            return {"error": "Ingestion API returned invalid JSON."}, 500

@coordinate_ns.route("/xenocanto")
class Xenocanto(Resource):
    @require_token()
    def get(self):
        """
        Retrieves bird sound recordings from the XenoCanto API in Castilla y León.

        This endpoint proxies the `/xenocanto/` endpoint in the ingestion API (`ai4birds-ingest-service`).

        Authentication:
            This endpoint is private and requires a valid JWT access token in the `Authorization` header.

        Returns:
            :return: Data from the XenoCanto ingestion service.
            :rtype: dict
        """

        try:
            response = requests.get(f"{config.URL_INGEST}/xenocanto/")

            if response.status_code != 200:
                response.raise_for_status()

            data = response.json()
            return data, 200

        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[XenoCanto] Error response: {response.status_code} - {response.text}")
            return {"error": f"Failed to fetch XenoCanto data: {error_message}"}, response.status_code
        
        except requests.exceptions.RequestException as e:
            logger.error(f"[XenoCanto] Exception during request: {e}")
            return {"error": "Failed to contact ingestion API for XenoCanto."}, 500

        except ValueError as e:
            logger.error(f"[XenoCanto] Invalid JSON response: {e}")
            return {"error": "Ingestion API returned invalid JSON."}, 500
        
@coordinate_ns.route("/sensitivity")
class Sensitivity(Resource):
    @require_token()
    def get(self):
        """
        Retrieves bird sensitivity zone data in Castilla y León.

        This endpoint proxies the `sensitivity/` endpoint in the ingestion API (`ai4birds-ingest-service`).

        Authentication:
            This endpoint is private and requires a valid JWT access token in the `Authorization` header.

        Returns:
            :return: Sensitivity data from the ingestion service.
            :rtype: dict
        """

        try:
            response = requests.get(f"{config.URL_INGEST}/sensitivity/")

            if response.status_code != 200:
                response.raise_for_status()

            data = response.json()
            return data, 200

        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[Sensitivity] Error response: {response.status_code} - {response.text}")
            return {"error": f"Failed to fetch sensitivity data: {error_message}"}, response.status_code

        except requests.exceptions.RequestException as e:
            logger.error(f"[Sensitivity] Exception during request: {e}")
            return {"error": "Failed to contact ingestion API for sensitivity data."}, 500

        except ValueError as e:
            logger.error(f"[Sensitivity] Invalid JSON response: {e}")
            return {"error": "Ingestion API returned invalid JSON."}, 500
        
# -------------------- ENDPOINTS PUBLICOS --------------------

@coordinate_ns.route("/dataBird")
class DataBird(Resource):
    def get(self):
        """
        Forwards GET request to the ingestion API for combined eBird and XenoCanto data.

        Returns:
            :return: Combined bird data from ingestion service.
            :rtype: dict
        """
        try:
            response = requests.get(f"{config.URL_INGEST}/dataBird/")  
            if response.status_code != 200:
                response.raise_for_status()

            return response.json(), 200

        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[DataBird] Error: {response.status_code} - {response.text}")
            return {"error": f"Error retrieving DataBird information: {error_message}"}, response.status_code

        except Exception as e:
            logger.error(f"[DataBird] Exception: {e}")
            return {"error": "Failed to call DataBird ingestion service."}, 500


@coordinate_ns.route("/windmap")
class WindMap(Resource):
    def post(self):
        """
        Forwards wind map POST request to ingestion API.

        Returns:
            :return: Result from ingestion windmap endpoint.
            :rtype: dict
        """
        try:
            response = requests.post(f"{config.URL_INGEST}/windmap/", json=request.get_json())
            if response.status_code != 200:
                response.raise_for_status()
            return response.json(), 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[WindMap] Error: {response.status_code} - {response.text}")
            return {"error": f"Error getting wind map data: {error_message}"}, response.status_code

        except Exception as e:
            logger.error(f"[WindMap] Exception: {e}")
            return {"error": "Failed to call wind map ingestion service."}, 500


@coordinate_ns.route("/exclusionmap")
class ExclusionMap(Resource):
    def post(self):
        """
        Forwards exclusion map POST request to ingestion API.

        Returns:
            :return: Result from ingestion exclusion map endpoint.
            :rtype: dict
        """
        try:
            response = requests.post(f"{config.URL_INGEST}/exclusionmap/", json=request.get_json())
            if response.status_code != 200:
                response.raise_for_status()
            return response.json(), 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[ExclusionMap] Error: {response.status_code} - {response.text}")
            return {"error": f"Error getting exclusion map data: {error_message}"}, response.status_code
        
        except Exception as e:
            logger.error(f"[ExclusionMap] Exception: {e}")
            return {"error": "Failed to call exclusion map ingestion service."}, 500


@coordinate_ns.route("/exclusionmap/zip")
class ExclusionMapZip(Resource):
    def get(self):
        """
        Forwards exclusion map ZIP request to ingestion API.

        Returns:
            :return: ZIP file from ingestion.
            :rtype: FileResponse
        """
        try:
            response = requests.get(f"{config.URL_INGEST}/exclusionmap/zip")
            return (response.content, response.status_code, {
                "Content-Type": "application/zip",
                "Content-Disposition": "attachment; filename=data.zip"
            })

        except Exception as e:
            logger.error(f"[ExclusionMapZip] Exception: {e}")
            return {"error": "Failed to download exclusion map ZIP."}, 500


@coordinate_ns.route("/exclusionmap/stream-exclusion-data")
class ExclusionMapStream(Resource):
    def post(self):
        """
        Forwards exclusion map streaming request to ingestion API.

        Returns:
            :return: Stream response status from ingestion.
            :rtype: dict
        """
        try:
            response = requests.post(f"{config.URL_INGEST}/exclusionmap/stream-exclusion-data", json=request.get_json())
            if response.status_code != 200:
                response.raise_for_status()
            return response.json(), 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[ExclusionMapStream] Error: {response.status_code} - {response.text}")
            return {"error": f"Error streaming exclusion data: {error_message}"}, response.status_code

        except Exception as e:
            logger.error(f"[ExclusionMapStream] Exception: {e}")
            return {"error": "Failed to call exclusion map stream endpoint."}, 500


@coordinate_ns.route("/device-status")
class DeviceStatus(Resource):
    def post(self):
        """
        Forwards device status POST request to ingestion API.

        Returns:
            :return: Result from ingestion device-status endpoint.
            :rtype: dict
        """
        try:
            response = requests.post(f"{config.URL_INGEST}/device-status/", json=request.get_json())
            if response.status_code != 200:
                response.raise_for_status()
            
            return response.json(), 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[DeviceStatus] Error: {response.status_code} - {response.text}")
            return {"error": f"Error posting device status: {error_message}"}, response.status_code
        
        except Exception as e:
            logger.error(f"[DeviceStatus] Exception: {e}")
            return {"error": "Failed to call device-status ingestion service."}, 500


@coordinate_ns.route("/device-status/latest")
class DeviceStatusLatest(Resource):
    def get(self):
        """
        Forwards request to get the latest device status.

        Returns:
            :return: Latest status from ingestion API.
            :rtype: dict
        """
        try:
            response = requests.get(f"{config.URL_INGEST}/device-status/latest")
            if response.status_code != 200:
                response.raise_for_status()
            return response.json(), 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[DeviceStatusLatest] Error: {response.status_code} - {response.text}")
            return {"error": f"Error getting latest device status: {error_message}"}, response.status_code
        
        except Exception as e:
            logger.error(f"[DeviceStatusLatest] Exception: {e}")
            return {"error": "Failed to get latest device status."}, 500


@coordinate_ns.route("/device-status/health")
class DeviceHealth(Resource):
    def get(self):
        """
        Forwards request to get device health status.

        Returns:
            :return: Device health from ingestion API.
            :rtype: dict
        """
        try:
            response = requests.get(f"{config.URL_INGEST}/device-status/health")
            if response.status_code != 200:
                response.raise_for_status()
            return response.json(), 200
        
        except request.exceptions.HTTPError as e:
            error_message = response.json().get("error", response.text)
            logger.error(f"[DeviceHealth] Error: {response.status_code} - {response.text}")
            return {"error": f"Error getting device health: {error_message}"}, response.status_code
        
        except Exception as e:
            logger.error(f"[DeviceHealth] Exception: {e}")
            return {"error": "Failed to get device health status."}, 500