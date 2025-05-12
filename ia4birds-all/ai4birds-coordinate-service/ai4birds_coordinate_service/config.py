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


#URL_INGEST = 'http://ia4birds-pre.der.usal.es:5002/ai4birds-ingest-service/v1'
URL_INGEST = os.getenv('PYTHON_URL')

#SECRET_KEY = os.getenv('SECRET_KEY')
SECRET_KEY ="secretKey"