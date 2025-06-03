#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
import time
import requests
from functools import lru_cache
from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service import config
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class XenoCanto_Extractor():
    @lru_cache(maxsize=128)
    @retry(
        reraise=True,
        stop=stop_after_attempt(3),  # máximo 3 intentos totales
        wait=wait_exponential(multiplier=1, min=1, max=60),
        retry=retry_if_exception_type(requests.exceptions.RequestException)
    )
    def xenocanto_query(self):
        """
        Query the Xeno-Canto API to obtain recordings of birds specific to Spain,
        filtering for those located in Castilla y León.

        Args:

        Returns:
            all_results: List of dictionaries, where each dictionary contains 
            the information of a bird recording.
        """
        query = 'cnt:spain'
        page = 1
        all_results = []

        while True:
            URL = f'http://www.xeno-canto.org/api/2/recordings?query={query}&page={page}'
            response = requests.get(URL)
            response.raise_for_status()
            data = response.json()
            
            all_results.extend(bird for bird in data['recordings'] if 'Castilla y León' in bird.get('loc'))
            
            

            if page >= data['numPages']:
                break
            page += 1
          
       
        return self._format_results(all_results)
    
    def _format_results(self, data):
        species_list = config.SPECIES_LIST.values()
        
        formatted_results = [{
                    "speciesSciName": f"{bird['gen']} {bird['sp']}",
                    "recordings": [{
                        "recordingId": bird['id'],
                        "location": bird['loc'],
                        "quality": bird['q'],
                        "lat": bird['lat'],
                        "lng": bird['lng'],
                        "alt": bird['alt'],
                        "file": bird['file'],
                        "file-name": bird['file-name'],
                        "time": bird['time'],
                        "date": bird['date']
                    }]
                }
            for bird in data
            if f"{bird['gen']} {bird['sp']}" in species_list]

        return formatted_results