#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
from ai4birds_ingest_service.api.namespaces.ingest_ns import ns_ebird, ns_xenocanto, ns_windmap, ns_exclusionmap

__author__ = 'AIRInstitute'
__version__ = '1.0'


namespaces = []
namespaces.append(ns_ebird)
namespaces.append(ns_xenocanto)
namespaces.append(ns_windmap)
namespaces.append(ns_exclusionmap)