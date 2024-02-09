#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import pandas as pd

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
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', error_bad_lines=False)
            clean_data = DataConverter.clean_invalid_characters(data)  # Llama al método estático correctamente
            json_result = clean_data.to_dict(orient='records')
            return json_result
        except Exception as e:
            return {'error': str(e)}
