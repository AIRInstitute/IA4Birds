#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
from flask import request
from ...utils.decorators import require_token
from flask_restx import Namespace, Resource
from ai4birds_coordinate_service.services import bird_data_service, map_service, device_service

coordinate_ns = Namespace("coordinate", description="Coordinate API Gateway")

# -------------------- ENDPOINT PRIVADOS --------------------

@coordinate_ns.route("/ebird")
class EBird(Resource):
    @require_token()
    def get(self):
        """
        Retrieves bird observation data from the eBird API in Castilla y León.
        
        Authentication:
            This endpoint is private and requires a valid JWT access token.
        """
        data, status_code = bird_data_service.get_ebird_data()
        return data, status_code

@coordinate_ns.route("/xenocanto")
class Xenocanto(Resource):
    @require_token()
    def get(self):
        """
        Retrieves bird sound recordings from the XenoCanto API in Castilla y León.
        
        Authentication:
            This endpoint is private and requires a valid JWT access token.
        """
        data, status_code = bird_data_service.get_xenocanto_data()
        return data, status_code
        
@coordinate_ns.route("/sensitivity")
class Sensitivity(Resource):
    @require_token()
    def get(self):
        """
        Retrieves bird sensitivity zone data in Castilla y León.
        
        Authentication:
            This endpoint is private and requires a valid JWT access token.
        """
        data, status_code = bird_data_service.get_sensitivity_data()
        return data, status_code
        
# -------------------- ENDPOINTS PUBLICOS --------------------

@coordinate_ns.route("/dataBird")
class DataBird(Resource):
    def get(self):
        """Forwards GET request to the ingestion API for combined eBird and XenoCanto data."""
        data, status_code = bird_data_service.get_combined_bird_data()
        return data, status_code

@coordinate_ns.route("/windmap")
class WindMap(Resource):
    def post(self):
        """Forwards wind map POST request to ingestion API."""
        data, status_code = map_service.post_wind_map_data(request.get_json())
        return data, status_code

@coordinate_ns.route("/exclusionmap")
class ExclusionMap(Resource):
    def post(self):
        """Forwards exclusion map POST request to ingestion API."""
        data, status_code = map_service.post_exclusion_map_data(request.get_json()) 
        return data, status_code

@coordinate_ns.route("/exclusionmap/zip")
class ExclusionMapZip(Resource):
    def get(self):
        """Forwards exclusion map ZIP request to ingestion API."""
        return map_service.get_exclusion_map_zip()
        
@coordinate_ns.route("/exclusionmap/all")
class ExclusionMapAll(Resource):
    def get(self):
        """Forwards exclusion map full JSON data from ingestion API."""
        data, status_code = map_service.get_all_exclusion_map_data()
        return data, status_code

@coordinate_ns.route("/exclusionmap/stream-exclusion-data")
class ExclusionMapStream(Resource):
    def post(self):
        """Forwards exclusion map streaming request to ingestion API."""
        data, status_code = map_service.stream_exclusion_data(request.get_json())
        return data, status_code

@coordinate_ns.route("/device-status")
class DeviceStatus(Resource):
    def post(self):
        """Forwards device status POST request to ingestion API."""
        data, status_code = device_service.post_device_status(request.get_json())
        return data, status_code

@coordinate_ns.route("/device-status/latest")
class DeviceStatusLatest(Resource):
    def get(self):
        """Forwards request to get the latest device status."""
        data, status_code = device_service.get_latest_device_status()
        return data, status_code

@coordinate_ns.route("/device-status/health")
class DeviceHealth(Resource):
    def get(self):
        """Forwards request to get device health status."""
        data, status_code = device_service.get_device_health()
        return data, status_code