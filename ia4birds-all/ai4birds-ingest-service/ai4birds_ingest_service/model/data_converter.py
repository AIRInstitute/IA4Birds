import pandas as pd
import json
import tempfile
import zipfile
import os
import re
import math
from functools import lru_cache
from shapely import wkt
from time import sleep
import gzip
from ai4birds_ingest_service.log import logger

class DataConverter:
    @staticmethod
    def clean_invalid_characters(data_frame: pd.DataFrame) -> pd.DataFrame:
        """Limpia los caracteres inválidos de un DataFrame de Pandas."""
        for column in data_frame.columns:
            if data_frame[column].dtype == object:
                data_frame[column] = data_frame[column].apply(
                    lambda x: x.encode('utf-8', 'replace').decode('utf-8') if isinstance(x, str) else x
                )
        return data_frame

    @staticmethod
    def extract_coordinates_from_wkt(wkt):
        try:
            # Encuentra todas las cadenas de texto que parezcan coordenadas dentro de los paréntesis triples
            #match = re.findall(r'\(\(\(([^)]+)\)\)\)', wkt)
            match = re.findall(r'\(\(\((.*?)\)\)\)', wkt, re.DOTALL)
            if not match:
                print(f"NOT MATCH: {len(wkt)}")
                print("Preview of WKT:", wkt[:100])

                sleep(10)  # Esto detendrá la ejecución durante 10 segundos
                return []
            # El primer match contiene las coordenadas que necesitamos
            coordinates_str = match[0]
            # Elimina espacios adicionales y divide el string por comas para separar cada par de coordenadas
            coordinates_pairs = coordinates_str.split(',')
            # Elimina espacios en blanco al inicio y al final de cada par
            coordinates_pairs = [pair.strip() for pair in coordinates_pairs]
            # Convierte cada par de coordenadas a tuplas de float, asegurándose de eliminar cualquier paréntesis residual
            coordinates = []
            count = 0
            for pair in coordinates_pairs:
                # Elimina los paréntesis residuales y divide por el espacio
                clean_pair = re.sub(r'[()]', '', pair).split()
                # Asegura que hay dos elementos antes de convertir a float
                if len(clean_pair) == 2:
                    lon, lat = map(float, clean_pair)
                    coordinates.append((lat, lon))
                    count += 1
                    if count == 3:
                        break  # Sale del bucle después de añadir el primer par de coordenadas

            
            return coordinates
        except Exception as e:
            print(f"Error extract coordinate from wtk: {e}")
            return {'error': str(e)}

    @staticmethod
    def _paginate_data(data_list, page_size=10, page_number=1):
        """ Paginate data

        :param data_list: list of data entries
        :type data_list: list
        :param page_size: page size, defaults to 10
        :type page_size: int, optional
        :param page_number: page number, defaults to 1
        :type page_number: int, optional
        :return: pagination info and paginated data list
        :rtype: dict
        """        
        # Asegurar que los parámetros de paginación son enteros válidos
        page_size = int(page_size)
        page_number = int(page_number)

        total_data = len(data_list)
        #total_pages = math.ceil(total_data / page_size) if page_size else 1
        total_pages = max(1, (total_data + page_size - 1) // page_size)
        current_page = max(1, min(page_number, total_pages))
        # Asegurar que el número de página está dentro del rango válido
        if page_number < 1 or page_number > total_pages:
            return {
                "pagination_info": {
                    'current_page': page_number,
                    'total_data': total_data,
                    'total_pages': total_pages,
                    'page_size': page_size
                },
                "data": []
            }
        
        start_index = (current_page - 1) * page_size
        end_index = start_index + page_size
        print(f"Start index {start_index} and End Index {end_index}")
        paginated_list = data_list[start_index:end_index]
        print(f"El tamaño de la lista paginada es: {len(paginated_list)}")

        pagination_info = {
            'current_page': current_page,
            'total_data': total_data,
            'total_pages': total_pages,
            'page_size': page_size
        }

        return {
            'pagination_info': pagination_info,
            'data': paginated_list
        }

    @staticmethod
    @lru_cache(maxsize=128)
    def csv_to_json(filepath: str, page: int = 1, page_size: int = 10) -> dict:
        # Pandas ya decodifica automáticamente los caracteres inválidos y se
        # salta las líneas con errores, por lo que no es necesario limpiar los datos
        data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
        data['identific'] = data['identific'].fillna('null').str.replace('"', '')

        # Combinamos las columnas de latitud y longitud en una sola lista de coordenadas
        data['coordenadas'] = data[['Latitud', 'Longitud']].values.tolist()
        data.drop(['Latitud', 'Longitud'], axis=1, inplace=True)

        # Crear una lista de diccionarios, cada uno representando una fila
        data_list = data.to_dict('records')
            }

            for _, row in data.iterrows()
        ]
            
        # Antes de devolver, usa _paginate_data para paginar data_list
        pagination_result = DataConverter._paginate_data(data_list, page_size, page)

        logger.info(f"Data paginated: {len(pagination_result['data'])}")
        return {
            'data': pagination_result['data'],
            'metadata': pagination_result['pagination_info']
        }

    @staticmethod
    @lru_cache(maxsize=128)
    def csv_to_json_full(filepath):
        """Convierte un CSV completo a JSON y lo guarda en un archivo ZIP."""
        try:
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
            clean_data = DataConverter.clean_invalid_characters(data)
            print(f"Invalid Character OK")
            # Procesar datos adicionales si es necesario
            clean_data['identific'] = clean_data['identific'].fillna('null').str.replace('"', '')            
            clean_data['coordenadas'] = clean_data['WKT'].apply(DataConverter.extract_coordinates_from_wkt)
            
            # Excluir las columnas 'WKT', 'gml_id', y 'geometry'
            if 'WKT' in clean_data.columns:
                clean_data.drop('WKT', axis=1, inplace=True)
            if 'gml_id' in clean_data.columns:
                clean_data.drop('gml_id', axis=1, inplace=True)
            if 'geometry' in clean_data.columns:
                clean_data.drop('geometry', axis=1, inplace=True)

            # Convertir DataFrame a una lista de diccionarios para JSON
            data_list = clean_data.to_dict(orient='records')
            print(f"Data List OK")
            # Convertir a string JSON
            json_str = json.dumps({'data': data_list}, ensure_ascii=False, indent=4)
            print(f"Convert a STRING OK")
            # Crear un archivo temporal para el JSON
            fd_json, path_json = tempfile.mkstemp(suffix='.json')
            with os.fdopen(fd_json, 'w', encoding="utf-8") as tmp_json:
                tmp_json.write(json_str)
            print(f"PATH JSON {path_json}")
            # Crear otro archivo temporal para el ZIP
            fd_zip, path_zip = tempfile.mkstemp(suffix='.zip')
            with zipfile.ZipFile(path_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(path_json, arcname='data.json')
            print(f"PATH ZIP {path_zip}")
            # Limpiar el archivo temporal JSON
            os.remove(path_json)
            print(f"CLEAND TEMP FILE OK")
            # Retornar la ruta del archivo ZIP
            return path_zip
        except Exception as e:
            print(f"Error al convertir CSV a JSON y comprimir: {e}")
            return None
        
    @staticmethod
    @lru_cache(maxsize=128)
    def csv_to_json_gzip(filepath, page=1, page_size=10):
        """Lee un archivo CSV comprimido, limpia los datos y devuelve JSON paginado."""
        try:
            with gzip.open(filepath, 'rt', encoding='utf-8') as file:
                data = pd.read_csv(file, sep=';', on_bad_lines='skip')
                clean_data = DataConverter.clean_invalid_characters(data)
                
                clean_data['identific'] = clean_data['identific'].fillna('null').str.replace('"', '')
                clean_data['coordenadas'] = clean_data['WKT'].apply(DataConverter.extract_coordinates_from_wkt)

                # Convertir a lista de diccionarios y paginar
                data_list = []
                for index, row in clean_data.iterrows():
                    row_dict = {
                        'fid': row['fid'],
                        'criterio': row['criterio'],
                        't_instalac': row['t_instalac'],
                        'ambito': row['ambito'],
                        'area_excl': row['area_excl'],
                        'espacio': row['espacio'],
                        'identific': row['identific'],
                        'coordenadas': row['coordenadas']
                    }
                    data_list.append(row_dict)
                
                # Paginación
                pagination_result = DataConverter._paginate_data(data_list, page_size, page)

                return {
                    'data': pagination_result['data'],
                    'metadata': pagination_result['pagination_info']
                }
        except Exception as e:
            print(f"Error converting compressed CSV to JSON: {e}")
            return {'error': str(e)}
        
    @staticmethod
    @lru_cache(maxsize=128)
    def csv_to_json_sensitivity(filepath):
        try:

            data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
            clean_data = DataConverter.clean_invalid_characters(data)  # Llama al método estático correctamente
            json_result = clean_data.to_dict(orient='records')
            return json_result
        except Exception as e:
            return {'error': str(e)}
        
    @staticmethod
    # @lru_cache(maxsize=128)
    def stream_csv_data(filepath, page_size=50):
        try:
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
            clean_data = DataConverter.clean_invalid_characters(data)

            clean_data['identific'] = clean_data['identific'].fillna('null').str.replace('"', '')
            clean_data['coordenadas'] = clean_data['WKT'].apply(DataConverter.extract_coordinates_from_wkt)

            for start in range(0, len(clean_data), page_size):
                end = start + page_size
                batch = clean_data.iloc[start:end]

                data_list = [
                    {
                        'fid': row['fid'],
                        'criterio': row['criterio'],
                        't_instalac': row['t_instalac'],
                        'ambito': row['ambito'],
                        'area_excl': row['area_excl'],
                        'espacio': row['espacio'],
                        'identific': row['identific'],
                        'coordenadas': row['coordenadas']  
                    }
                    for _, row in batch.iterrows()
                ]
                yield data_list

        except Exception as e:
            print(e)
            print(f"Error streaming CSV data: {e.__str__()}")
            yield {'error': str(e)}