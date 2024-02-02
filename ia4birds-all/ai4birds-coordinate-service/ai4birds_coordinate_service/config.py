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

#DB config
DB_CONFIG={
    'host' : "ethicalnews.bisite.usal.es",
    'port' : 1338,
    'user' : "news_user",
    'password' : "n3ws_2023?!",
    'database' : "ethicalTask"
}

# URLS
EBIRD_URL = 'http://localhost:5001/ai4birds-ingest-service/v1/ebird/'
CRUD_URL = 'http://localhost:5001/ai4birds-ingest-service/v1/crud/'
XENOCANTO_URL = 'http://localhost:5001/ai4birds-ingest-service/v1/xenocanto/'
WINDMAP_URL = 'http://localhost:5001/ai4birds-ingest-service/v1/windmap/'
EXCLUSIONMAP_URL = 'http://localhost:5001/ai4birds-ingest-service/v1/exclusionmap/'
