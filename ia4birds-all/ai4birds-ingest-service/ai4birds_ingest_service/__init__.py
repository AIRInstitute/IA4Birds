#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


__author__ = 'AIRInstitute'
__version__ = '1.0'

from flask_socketio import SocketIO,join_room, leave_room, emit

from .log import serve_application_logger
logger = serve_application_logger()
socketio = SocketIO()