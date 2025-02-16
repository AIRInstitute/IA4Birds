#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
import time
import requests
from functools import lru_cache
from ai4birds_ingest_service.log import logger
from ai4birds_ingest_service import config

class XenoCanto_Extractor():
    @lru_cache(maxsize=128)
    def xenocanto_query(self, max_retries=3, backoff_factor=1):
        """
        Query the Xeno-Canto API to obtain recordings of birds specific to Spain,
        filtering for those located in Castilla y León.

        Args:
            :param max_retries: maximum number of retries.
            :type max_retries: int
            :param backoff_factor: backoff factor.
            :type backoff_factor: int

        Returns:
            all_results: List of dictionaries, where each dictionary contains 
            the information of a bird recording.
        """
        query = 'cnt:spain'
        page = 1
        all_results = []
        retry_count = 0

        while True:
            url = f'http://www.xeno-canto.org/api/2/recordings?query={query}&page={page}'
            try:
                
                response = requests.get(url)
                
                response.raise_for_status()
                
                data = response.json()
                #print(f"Datos obtenidos de la API (página {page}):", data)
                all_results.extend(bird for bird in data['recordings'] if 'Castilla y León' in bird.get('loc'))
                
                

                if page >= data['numPages']:
                    break
                page += 1
            except requests.exceptions.RequestException as e:
                logger.error(f'Request xenocanto ERROR')
                if retry_count >= max_retries:
                    logger.error(f'Error get xenocanto query: {e}')
                    break  # Exit loop if max retries are reached
                retry_count += 1
                sleep_time = backoff_factor * (2 ** retry_count)
                logger.error(f'Request xenocanto ERROR, will retry after {sleep_time} seconds.')
                time.sleep(sleep_time)
        print(f"Total de grabaciones antes de filtrar por especies: {len(all_results)}")
        return self._format_results(all_results)
    
    def _format_results(self, data):
        species_list = config.SPECIES_LIST.values()
        formatted_results = []
        for bird in data:
            full_species_name = f"{bird['gen']} {bird['sp']}"
            #print(f"Especie encontrada: {full_species_name}")
            if full_species_name in species_list:  # Filtra por especie
                formatted_results.append({
                    "speciesSciName": full_species_name,
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
                })
            # formatted_results.append({
            #     "speciesSciName": f"{bird['gen']} {bird['sp']}",
            #     "recordings": [{
            #         "recordingId": bird['id'],
            #         "location": bird['loc'],
            #         "quality": bird['q'],
            #         "lat": bird['lat'],
            #         "lng": bird['lng'],
            #         "alt": bird['alt'],
            #         "file": bird['file'],
            #         "file-name": bird['file-name'],
            #         "time": bird['time'],
            #         "date": bird['date']
            #     }]
            # })
            
        print(f"Total de grabaciones después de filtrar por especies: {len(formatted_results)}")
        return formatted_results