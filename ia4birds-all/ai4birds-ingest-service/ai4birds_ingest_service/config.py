#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


import os


# api config
PORT = 5001
HOST = '0.0.0.0'
URL_PREFIX = '/ai4birds-ingest-service/v1'
DEBUG_MODE = True


DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'user': 'postgres',
    'password': 'password',
    'database': 'example'
}