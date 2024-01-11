#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests

class XenoCanto_Model():
    def xenocanto_query(self):
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
        return all_results