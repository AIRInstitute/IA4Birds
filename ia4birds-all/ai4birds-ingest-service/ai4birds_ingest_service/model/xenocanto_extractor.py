#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)
import time
import requests
from ai4birds_ingest_service.log import logger

class XenoCanto_Extractor():
    @staticmethod
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

        while True:
            try:
                url = f'http://www.xeno-canto.org/api/2/recordings?query={query}&page={page}'
                response = requests.get(url)
                response.raise_for_status()

                data = response.json()
                all_results.extend(bird for bird in data['recordings'] if 'Castilla y León' in bird.get('loc'))
                
                if page >= data['numPages']:
                    break
                page += 1
            except requests.exceptions.RequestException as e:
                if page >= max_retries:
                    logger.error(f'Error get xenocanto query: {e}')
                    break  # Exit loop if max retries are reached
                time.sleep(backoff_factor * (2 ** page))  # Exponential backoff
                continue  # Retry the same page again

        return self._format_results(all_results)
    
    def _format_results(self, data):
        formatted_results = []
        for bird in data:
            formatted_results.append({
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
            })
        return formatted_results