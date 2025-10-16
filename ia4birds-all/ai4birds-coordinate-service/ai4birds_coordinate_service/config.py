#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


import os


# api config
PORT = 5000
HOST = '0.0.0.0'
URL_PREFIX = '/ai4birds-coordinate-service/v1'
DEBUG_MODE = True

URL_INGEST = os.getenv('PYTHON_INGEST_URL')

SECRET_KEY ="secretKey"