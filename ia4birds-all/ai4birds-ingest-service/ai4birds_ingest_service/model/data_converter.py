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
    def sort_coordinates(coordinates):
        # Identifica los puntos más al norte, oeste, sur y este
        north = max(coordinates, key=lambda x: x[0])
        south = min(coordinates, key=lambda x: x[0])
        west = min(coordinates, key=lambda x: x[1])
        east = max(coordinates, key=lambda x: x[1])

        # Ordena las coordenadas según la especificación
        sorted_coords = [north, west, south, east]

        # Filtra duplicados para evitar repetir puntos que cumplen más de un criterio
        unique_sorted_coords = []
        for coord in sorted_coords:
            if coord not in unique_sorted_coords:
                unique_sorted_coords.append(coord)

        return unique_sorted_coords
    
    @staticmethod
    def csv_to_json(filepath):
        try:
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
            clean_data = DataConverter.clean_invalid_characters(data)
            
            # Asegurarse de que identific se presenta correctamente
            clean_data['identific'] = clean_data['identific'].str.replace('"', '')
            
            # Crea una columna con las coordenadas como tuplas
            clean_data['coordenadas'] = list(zip(clean_data['Latitud'], clean_data['Longitud']))
            clean_data['coordenadas'] = clean_data['coordenadas'].apply(DataConverter.sort_coordinates)

            # Agrupa por 'identific' y conserva todas las demás columnas
            def aggregate_rows(x):
                d = {}
                d['fid'] = x['fid'].tolist()[0]  # Asumiendo 'fid' es único dentro de cada grupo de 'identific'
                d['criterio'] = x['criterio'].tolist()[0]
                d['t_instalac'] = x['t_instalac'].tolist()[0]
                d['ambito'] = x['ambito'].tolist()[0]
                d['area_excl'] = x['area_excl'].tolist()[0]
                d['espacio'] = x['espacio'].tolist()[0]
                d['coordenadas'] = x['coordenadas'].tolist()  # Lista de tuplas
                return pd.Series(d, index=['fid', 'criterio', 't_instalac', 'ambito', 'area_excl', 'espacio', 'coordenadas'])

            grouped_data = clean_data.groupby('identific').apply(aggregate_rows).reset_index()

            # Convierte el DataFrame agrupado a JSON con ensure_ascii=False para mantener los caracteres especiales
            json_result = json.loads(grouped_data.to_json(orient='records', force_ascii=False))
            return json_result
        except Exception as e:
            return {'error': str(e)}
    