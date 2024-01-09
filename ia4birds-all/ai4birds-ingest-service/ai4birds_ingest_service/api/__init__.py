#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
from ai4birds_ingest_service.api.namespaces.ingest_ns import ns_db, ns_ebird, ns_xenocanto

__author__ = 'AIRInstitute'
__version__ = '1.0'


namespaces = []
namespaces.append(ns_db)
namespaces.append(ns_ebird)
namespaces.append(ns_xenocanto)