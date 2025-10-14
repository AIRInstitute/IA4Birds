#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


import os


# api config
PORT = 5002
HOST = '0.0.0.0'
URL_PREFIX = '/ai4birds-coordinate-service/v1'
DEBUG_MODE = True

#URL_INGEST = os.getenv('PYTHON_INGEST_URL')
URL_INGEST = 'http://localhost:5000/ai4birds-ingest-service/v1'

SECRET_KEY ="secretKey"