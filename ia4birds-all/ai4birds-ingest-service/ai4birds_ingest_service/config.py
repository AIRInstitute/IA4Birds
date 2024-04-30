#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


import os


# api config
# PORT = 5001
PORT = 5000
HOST = '0.0.0.0'
URL_PREFIX = '/ai4birds-ingest-service/v1'
DEBUG_MODE = True

#DB config
DB_CONFIG={
    'host' : "212.128.141.36",
    'port' : 1338,
    'user' : "ai4birds_user",
    'password' : "ai4birds_2024?!",
    'database' : "ingestDB"
}

# EBird password
EBIRD_PASSWORD = 'v1kfvin2apud'

# Files paths
CORRDENADAS_CSV_PATH = './ai4birds_ingest_service/utils/Corrdenadas_lat_long_SE_DN.csv'
#EXCLUSION_EOLICA_CSV_PATH = './ai4birds_ingest_service/utils/exclusion_eolica.csv.gz'
# EXCLUSION_EOLICA_CSV_PATH = './ai4birds_ingest_service/utils/exclusion_eolica (5).csv'
# API_SPEC_PATH = '/app/ai4birds_ingest_service/doc/api-spec.yaml'

EXCLUSION_EOLICA_CSV_PATH = '/home/exclusion_eolica.csv'
API_SPEC_PATH = '/app/ai4birds_ingest_service/doc/api-spec.yaml'
