#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

from dotenv import load_dotenv
import os

dotenv_path = '/etc/envs/.env'

load_dotenv(dotenv_path)

# api config
# PORT = 5001
PORT = 5000
HOST = '0.0.0.0'
URL_PREFIX = '/ai4birds-ingest-service/v1'
DEBUG_MODE = True

#DB config
DB_CONFIG={
    'host' : os.getenv('POSTGRES_INGEST_HOST'),
    'port' : os.getenv('POSTGRES_INGEST_PORT'),
    'user' : os.getenv('POSTGRES_INGEST_USER'),
    'password' : os.getenv('POSTGRES_INGEST_PASSWORD'),
    'database' : os.getenv('POSTGRES_INGEST_DB')
}

SPECIES_LIST = {
    "Quebrantahuesos": "Gypaetus barbatus",
    "Buitre negro": "Aegypius monachus",
    "Buitre leonado": "Gyps fulvus",
    "Alimoche común": "Neophron percnopterus",
    "Águila perdicera": "Aquila fasciata",
    "Águila imperial ibérica": "Aquila adalberti",
    "Águila real": "Aquila chrysaetos",
    "Águila pescadora": "Pandion haliaetus",
    "Milano real": "Milvus milvus",
    "Aguilucho pálido": "Circus cyaneus",
    "Aguilucho cenizo": "Circus pygargus",
    "Cernícalo primilla": "Falco naumanni",
    "Halcón tagarote": "Falco pelegrinoides",
    "Cigüeña negra": "Ciconia nigra",
    "Cigüeña común": "Ciconia ciconia",
    "Grulla común": "Grus grus",
    "Urogallo": "Tetrao urogallus",
    "Alondra ricotí": "Chersophilus duponti"
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
