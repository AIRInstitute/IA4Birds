#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests

class XenoCanto_Extractor():

    def xenocanto_query(self):
        """
        Query the Xeno-Canto API to obtain recordings of birds specific to Spain,
        filtering for those located in Castilla y León.

        Args:
            Does not take arguments.

        Returns:
            all_results: List of dictionaries, where each dictionary contains 
            the information of a bird recording.
        """


        query = 'cnt:spain'
        page = 1
        all_results = []

        while True:
            url = f'http://www.xeno-canto.org/api/2/recordings?query={query}&page={page}'

            try:
                response = requests.get(url)
                response.raise_for_status() 

                data = response.json()
                all_results.extend(bird for bird in data['recordings'] if 'Castilla y León' in bird.get('loc'))
            
                if page >= data['numPages']:
                    break
                page += 1
            except:
                raise 

            #Modificación para ajustar el formato de los resultados
            formatted_results = []
            for bird in all_results:
                formatted_results.append({
                    # Nombre científico
                    "speciesSciName": f"{bird['gen']} {bird['sp']}",
                    "recordings": [{
                        "recordingId": bird['id'],
                        "location": bird['loc'],
                        "quality": bird['q'],
                        "lat": bird['lat'],
                        "lng": bird['lng'],
                        "alt": bird['alt'],
                        "file":bird['file'],
                        "file-name":bird['file-name'],
                        "time": bird['time'],
                        "date": bird['date']
                    }]
                })
            return formatted_results