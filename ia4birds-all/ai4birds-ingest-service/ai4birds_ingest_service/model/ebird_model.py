#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests, json

from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service.config import EBIRD_PASSWORD

class EBird_Model:
    def ebird_query(self):
        regionCode = 'ES-CL'
        headers = {'X-eBirdApiToken': EBIRD_PASSWORD}
        # Last 30 days 
        url = f'https://api.ebird.org/v2/data/obs/{regionCode}/recent?back=30'
        try:
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                return(json.loads(response.text))
            else:
                return None
            
        except Exception as e:
            logger.error(f'Error get query: {e}')
            return None