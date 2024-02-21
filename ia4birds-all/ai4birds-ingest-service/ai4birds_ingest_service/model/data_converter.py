#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import pandas as pd
import json

class DataConverter:
    @staticmethod
    def clean_invalid_characters(data_frame):
        for column in data_frame.columns:
            if data_frame[column].dtype == object:  # Verifica si el dtype es object, lo que puede incluir cadenas
                # Aplica encode/decode solo a cadenas
                data_frame[column] = data_frame[column].apply(
                    lambda x: x.encode('utf-8', 'replace').decode('utf-8') if isinstance(x, str) else x
                )
        return data_frame
        
    @staticmethod
    def csv_to_json(filepath):
        try:
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
            clean_data = DataConverter.clean_invalid_characters(data)
            # Convierte el DataFrame a JSON con ensure_ascii=False para mantener los caracteres especiales
            json_result = json.loads(clean_data.to_json(orient='records', force_ascii=False))
            return json_result
        except Exception as e:
            return {'error': str(e)}