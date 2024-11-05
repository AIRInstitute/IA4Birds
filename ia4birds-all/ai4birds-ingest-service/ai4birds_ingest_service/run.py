#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


#from flask_socketio import SocketIO

from flask_cors import CORS
from flask import Flask, Blueprint, redirect, request
# from flask_caching import Cache
from ai4birds_ingest_service import config
from ai4birds_ingest_service import events
from ai4birds_ingest_service.api.v1 import api
from ai4birds_ingest_service.api import namespaces
from ai4birds_ingest_service.core import cache, limiter

from . import socketio

app = Flask(__name__)


# socketio = SocketIO(app)

VERSION = (1, 0)
AUTHOR = 'AIRInstitute'


def get_version():
    """
    This function returns the API version that is being used.
    """

    return '.'.join(map(str, VERSION))


def get_authors():
    """
    This function returns the API's author name.
    """

    return str(AUTHOR)


__version__ = get_version()
__author__ = get_authors()
    

@app.route('/')
def register_redirection():
    """
    Redirects to dcoumentation page.
    """

    return redirect(f'{request.url_root}/{config.URL_PREFIX}', code=302)


def initialize_app(flask_app):
    """
    This function initializes the Flask Application, adds the namespace and registers the blueprint.
    """
    CORS(flask_app)

    v1 = Blueprint('api', __name__, url_prefix=config.URL_PREFIX)
    api.init_app(v1)

    limiter.exempt(v1)

    cache.init_app(flask_app) 
    #cache.init_app(flask_app)

    for ns in namespaces:
        api.add_namespace(ns)
    
    flask_app.register_blueprint(v1)
    flask_app.config.from_object(config)


def main():
    initialize_app(app)
    separator_str = ''.join(map(str, ["=" for i in range(175)]))
    print(separator_str)
    print(f'Debug mode: {config.DEBUG_MODE}')
    print(f'Authors: {get_authors()}')
    print(f'Version: {get_version()}')
    print(f'Base URL: http://localhost:{config.PORT}{config.URL_PREFIX}')
    print(f'Socket URL: http://localhost:{config.PORT}')
    print(separator_str)
    
    # Inicializar SocketIO con la aplicación Flask cors_allowed_origins="*"
    socketio.init_app(app)
    
    # Ejecutar la aplicación con SocketIO
    socketio.run(app, host=config.HOST, port=config.PORT, debug=config.DEBUG_MODE, allow_unsafe_werkzeug=True)
    print(f'Ejecutado socket')

if __name__ == '__main__':
    main()