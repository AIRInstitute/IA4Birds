#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


from dotenv import load_dotenv
import os

dotenv_path = '/etc/envs/.env'

load_dotenv(dotenv_path)

# api config
PORT = 5000
HOST = '0.0.0.0'
URL_PREFIX = '/ai4birds-ai-service/v1'
DEBUG_MODE = True

DB_CONFIG={
    'host' : os.getenv('POSTGRES_ANALYSIS_HOST'),
    'port' : os.getenv('POSTGRES_ANALYSIS_PORT'),
    'user' : os.getenv('POSTGRES_ANALYSIS_USER'),
    'password' : os.getenv('POSTGRES_ANALYSIS_PASSWORD'),
    'database' : os.getenv('POSTGRES_ANALYSIS_DB')
}