#!/bin/bash
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)


sudo python3 -m pip install pip --upgrade
sudo python3 setup.py install --force
sudo ai4birds_ingest_service