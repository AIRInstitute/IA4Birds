#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

from flask_restx import Api

api = Api(version='1.0',
		  title='ai4birds-ingest-service',
		  description="Project description")