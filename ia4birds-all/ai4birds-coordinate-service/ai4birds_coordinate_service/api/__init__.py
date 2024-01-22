#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

__author__ = 'AIRInstitute'
__version__ = '1.0'

from ai4birds_coordinate_service.api.namespaces.coordinate_ns import ns, xenocanto_ns, ebird_ns, windmap_ns, exclusionmap_ns



namespaces = []
namespaces.append(ns)
namespaces.append(xenocanto_ns)
namespaces.append(ebird_ns)
namespaces.append(windmap_ns)
namespaces.append(exclusionmap_ns)