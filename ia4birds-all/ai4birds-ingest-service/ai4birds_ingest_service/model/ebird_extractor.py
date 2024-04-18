#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests, json
import time
from functools import lru_cache
from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service import config

class EBird_Extractor:
    @lru_cache(maxsize=100)
    def ebird_query(self, max_retries=3, backoff_factor=1):
        """
        Queries the eBird API for recent observations of birds 
        in the region of Castilla y León, Spain.

        The function queries the data for birds observed in the last 30 days. 
        Uses a custom API token for authentication.

        Args:
            :param max_retries: maximum number of retries.
            :type max_retries: int
            :param backoff_factor: backoff factor.
            :type backoff_factor: int

        Returns:
            If the query is successful, returns a list of observations in JSON format. 
            If the query fails returns None.
        """
        regionCode = 'ES-CL'
        headers = {'X-eBirdApiToken': config.EBIRD_PASSWORD}
        # Last 30 days 
        url = f'https://api.ebird.org/v2/data/obs/{regionCode}/recent?back=30'
        for attempt in range(max_retries):
            try:
                #logger.error(f'Request ebird')
                response = requests.get(url, headers=headers)
                #logger.error(f'Despues response')
                response.raise_for_status()
                #logger.error(f'Despues raise')
                return self._format_results(json.loads(response.text))
            except requests.exceptions.RequestException as e:
                logger.error(f'Error get query: {e}')
                time.sleep(backoff_factor * (2 ** attempt))  # Exponential backoff
        return None

    def _format_results(self, data):
        formatted_results = []
        #ogger.error(f'Format_RESULTS')
        for observation in data:
            formatted_results.append({
                "speciesSciName": observation['sciName'],
                "speciesCode": observation['speciesCode'],
                "comName": observation['comName'],
                "observations": [{
                    "obsDt": observation['obsDt'],
                    "locationId": observation['locId'],
                    "locationName": observation['locName'],
                    "lat": observation['lat'],
                    "lng": observation['lng'],
                    "date": observation['obsDt'],
                    "numObservation": observation.get('howMany', None)
                }]
            })
        #logger.error(f'antes return')
        return formatted_results 