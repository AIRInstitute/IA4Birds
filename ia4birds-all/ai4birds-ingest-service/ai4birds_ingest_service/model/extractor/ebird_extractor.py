#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests, json
import time
from functools import lru_cache
from ai4birds_ingest_service import config, logger
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class EBird_Extractor:
    @lru_cache(maxsize=128)
    @retry(
        reraise=True,  # para que la excepción suba después de agotar reintentos
        stop=stop_after_attempt(3),  # máximo 3 intentos
        wait=wait_exponential(multiplier=1, min=1, max=10),  # backoff exponencial entre 1s y 10s
        retry=retry_if_exception_type(requests.exceptions.RequestException)
    )
    def ebird_query(self):
        """
        Queries the eBird API for recent observations of birds 
        in the region of Castilla y León, Spain.

        The function queries the data for birds observed in the last 30 days. 
        Uses a custom API token for authentication.

        Args:
           

        Returns:
            If the query is successful, returns a list of observations in JSON format. 
            If the query fails returns None.
        """
        regionCode = 'ES-CL'
        HEADERS = {'X-eBirdApiToken': config.EBIRD_PASSWORD}
        # Last 30 days 
        URL = f'https://api.ebird.org/v2/data/obs/{regionCode}/recent?back=30'


        response = requests.get(URL, headers=HEADERS)

        response.raise_for_status()
        
        return self._format_results(json.loads(response.text))
        
        return None

    def _format_results(self, data):
        species_list = config.SPECIES_LIST.values()
        
        formatted_results = [ 
                {
                    "speciesSciName": observation['sciName'],
                    "speciesCode": observation['speciesCode'],
                    "comName": observation['comName'],
                    "observations": [{
                        "obsDt": observation['obsDt'],
                        "subId": observation.get('subId'),
                        "locationId": observation['locId'],
                        "locationName": observation['locName'],
                        "lat": observation['lat'],
                        "lng": observation['lng'],
                        "date": observation['obsDt'],
                        "numObservation": observation.get('howMany', None)
                    }]
                } for observation in data if observation['sciName'] in species_list]
        return formatted_results