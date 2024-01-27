#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests, json
from ai4birds_ingest_service.log import logger
# from ai4birds_ingest_service.config import EBIRD_PASSWORD
from ai4birds_ingest_service import config

class EBird_Extractor:
    def ebird_query(self):
        """
        Queries the eBird API for recent observations of birds 
        in the region of Castilla y León, Spain.

        The function queries the data for birds observed in the last 30 days. 
        Uses a custom API token for authentication.

        Args:
            Does not take arguments.

        Returns:
            If the query is successful, returns a list of observations in JSON format. 
            If the query fails returns None.
        """
        regionCode = 'ES-CL'
        #headers = {'X-eBirdApiToken': EBIRD_PASSWORD}
        headers = {'X-eBirdApiToken': config.EBIRD_PASSWORD}
        # Last 30 days 
        url = f'https://api.ebird.org/v2/data/obs/{regionCode}/recent?back=30'
        try:
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                #return(json.loads(response.text))
                # Modificación para ajustar el formato de los resultados
                formatted_results = []
                for observation in json.loads(response.text):
                    formatted_results.append({
                        # Nombre científico
                        "speciesSciName": observation['sciName'], 
                        "speciesCode": observation['speciesCode'],
                        "comName": observation['comName'],
                        "observations": [{
                            "obsDt": observation['obsDt'],
                            "locationId": observation['locId'],
                            "location-name": observation['locName'],
                            "lat": observation['lat'],
                            "lng": observation['lng'],
                            "date": observation['obsDt'],
                            "numObservation": observation['howMany']
                        }]
                    })
                return formatted_results

            else:
                return None
            
        except Exception as e:
            logger.error(f'Error get query: {e}')
            return None