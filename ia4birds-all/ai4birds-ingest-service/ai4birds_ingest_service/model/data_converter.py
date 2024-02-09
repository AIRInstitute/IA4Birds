# data_converter.py

import pandas as pd

class DataConverter:
    @staticmethod
    def csv_to_json(filepath):
        try:
            
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', error_bad_lines=False)
            data_dict = data.to_dict(orient='records')

            return data_dict 
        except Exception as e:
            return {'error': str(e)}
