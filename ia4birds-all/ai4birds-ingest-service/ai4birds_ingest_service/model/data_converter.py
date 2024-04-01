# import pandas as pd
# import json

# class DataConverter:
#     @staticmethod
#     def clean_invalid_characters(data_frame):
#         for column in data_frame.columns:
#             if data_frame[column].dtype == object:  # Verifica si el dtype es object, lo que puede incluir cadenas
#                 # Aplica encode/decode solo a cadenas
#                 data_frame[column] = data_frame[column].apply(
#                     lambda x: x.encode('utf-8', 'replace').decode('utf-8') if isinstance(x, str) else x
#                 )
#         return data_frame
        
#     @staticmethod
#     def sort_coordinates(coordinates):
#         # Verifica si hay más de un par de coordenadas para ordenar
#         if len(coordinates) > 1:
#             print(f"Sorting coordinates: {coordinates} and len {len(coordinates)}")  
#             try:
#                 north = max(coordinates, key=lambda x: x[0])
#                 south = min(coordinates, key=lambda x: x[0])
#                 west = min(coordinates, key=lambda x: x[1])
#                 east = max(coordinates, key=lambda x: x[1])

#                 sorted_coords = [north, west, south, east]

#                 unique_sorted_coords = []
#                 for coord in sorted_coords:
#                     if coord not in unique_sorted_coords:
#                         unique_sorted_coords.append(coord)
                
#                 return unique_sorted_coords
#             except TypeError as e:
#                 print(f"Error sorting coordinates: {e}, {coordinates}") 
#                 return coordinates  # Retorna las coordenadas originales en caso de error
#         else:
#             # Si solo hay un par de coordenadas o ninguna, devuelve las coordenadas sin modificar
#             return coordinates
#     @staticmethod
#     def csv_to_json(filepath):
#         try:
#             data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')
#             print(f"Initial data loaded: {data.head()}")  # Muestra las primeras filas

#             clean_data = DataConverter.clean_invalid_characters(data)
            
#             clean_data['identific'] = clean_data['identific'].str.replace('"', '')
            
#             clean_data['coordenadas'] = list(zip(clean_data['Latitud'], clean_data['Longitud']))
#             print(f"Coordinates column created: {clean_data['coordenadas'].head()}")  # Verificar la creación de la columna

#             # Elimina duplicados preservando el orden
#             def eliminar_duplicados_preservando_orden(coordenadas):
#                 vistas = set()
#                 coordenadas_unicas = []
#                 for coordenada in coordenadas:
#                     if coordenada not in vistas:
#                         coordenadas_unicas.append(coordenada)
#                         vistas.add(coordenada)
#                 return coordenadas_unicas

#             # Aplica la función para eliminar duplicados
#             #clean_data['coordenadas'] = clean_data['coordenadas'].apply(eliminar_duplicados_preservando_orden)


#             clean_data['coordenadas'] = clean_data['coordenadas'].apply(DataConverter.sort_coordinates)
#              # Aplica la función para eliminar duplicados
#             clean_data['coordenadas'] = clean_data['coordenadas'].apply(eliminar_duplicados_preservando_orden)

#             def aggregate_rows(x):
#                 d = {}
#                 d['fid'] = x['fid'].tolist()[0]
#                 d['criterio'] = x['criterio'].tolist()[0]
#                 d['t_instalac'] = x['t_instalac'].tolist()[0]
#                 d['ambito'] = x['ambito'].tolist()[0]
#                 d['area_excl'] = x['area_excl'].tolist()[0]
#                 d['espacio'] = x['espacio'].tolist()[0]
#                 d['coordenadas'] = x['coordenadas'].tolist()
#                 return pd.Series(d, index=['fid', 'criterio', 't_instalac', 'ambito', 'area_excl', 'espacio', 'coordenadas'])

#             grouped_data = clean_data.groupby('identific').apply(aggregate_rows).reset_index()
#             print(f"Grouped data: {grouped_data.head()}")  # Inspecciona los datos agrupados

#             json_result = json.loads(grouped_data.to_json(orient='records', force_ascii=False))
#             return json_result
#         except Exception as e:
#             print(f"Error converting CSV to JSON: {e}")  # Impresión de error
#             return {'error': str(e)}

import pandas as pd
import json

class DataConverter:
    @staticmethod
    def clean_invalid_characters(data_frame):
        for column in data_frame.columns:
            if data_frame[column].dtype == object:
                data_frame[column] = data_frame[column].apply(
                    lambda x: x.encode('utf-8', 'replace').decode('utf-8') if isinstance(x, str) else x
                )
        return data_frame

    @staticmethod
    def sort_and_deduplicate_coordinates(coordinates):
        if len(coordinates) > 1:
            try:
                # Ordena las coordenadas siguiendo el patrón norte, oeste, sur, este
                north = max(coordinates, key=lambda x: x[0])
                west = min(coordinates, key=lambda x: x[1])
                south = min(coordinates, key=lambda x: x[0])
                east = max(coordinates, key=lambda x: x[1])

                # Prepara la lista inicial con ordenamiento específico
                ordered_coords = [north, west, south, east]

                # Elimina duplicados manteniendo el orden
                seen = set()
                unique_coords = []
                for coord in ordered_coords:
                    if tuple(coord) not in seen:
                        unique_coords.append(coord)
                        seen.add(tuple(coord))

                return unique_coords
            except TypeError as e:
                print(f"Error sorting coordinates: {e}")
                return coordinates
        else:
            return coordinates

    @staticmethod
    def deduplicate_coordinates(coordinates):
        # Utiliza un set para eliminar duplicados, ya que los sets no permiten duplicados
        unique_coords_set = {tuple(coord) for coord in coordinates}
        # Convierte de nuevo a lista para mantener el formato original
        return list(unique_coords_set)


    @staticmethod
    def csv_to_json(filepath):
        try:
            data = pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')

            clean_data = DataConverter.clean_invalid_characters(data)
            
            clean_data['identific'] = clean_data['identific'].str.replace('"', '')
            
            # Suponiendo que Latitud y Longitud ya están en tu DataFrame
            clean_data['coordenadas'] = list(zip(clean_data['Latitud'], clean_data['Longitud']))

            clean_data['coordenadas'] = clean_data['coordenadas'].apply(DataConverter.sort_and_deduplicate_coordinates)

            # Agrupación y generación de JSON como en tu código original
            def aggregate_rows(x):
                d = {}
                d['fid'] = x['fid'].iloc[0]
                d['criterio'] = x['criterio'].iloc[0]
                d['t_instalac'] = x['t_instalac'].iloc[0]
                d['ambito'] = x['ambito'].iloc[0]
                d['area_excl'] = x['area_excl'].iloc[0]
                d['espacio'] = x['espacio'].iloc[0]

                # Inicialmente, suponemos que 'coordenadas' podría ser una lista de listas, una lista simple o un valor singular.
                coordenadas_lista = x['coordenadas'].tolist()

                # Procesamos las coordenadas teniendo en cuenta los posibles formatos
                coordenadas_deduplicadas = []
                for item in coordenadas_lista:
                    if isinstance(item, list):
                        # Si el item es una lista, procedemos a deduplicar las coordenadas dentro de esta lista
                        set_de_coordenadas = set(tuple(subitem) for subitem in item if isinstance(subitem, list))
                        coordenadas_deduplicadas.extend(list(set_de_coordenadas))
                    elif isinstance(item, tuple):
                        # Si el item es una tupla, lo añadimos directamente
                        coordenadas_deduplicadas.append(item)
                    else:
                        # Para otros tipos (incluyendo flotantes), manejamos o ignoramos según el caso de uso específico
                        pass  # Opcional: añadir lógica para manejar flotantes o otros tipos

                # Eliminar duplicados a nivel global y convertir de nuevo a lista de listas
                coordenadas_deduplicadas = list(set(coordenadas_deduplicadas))
                d['coordenadas'] = [list(coord) for coord in coordenadas_deduplicadas]

                return pd.Series(d, index=['fid', 'criterio', 't_instalac', 'ambito', 'area_excl', 'espacio', 'coordenadas'])


                
            grouped_data = clean_data.groupby('identific').apply(aggregate_rows).reset_index()
            print(f"Grouped data: {grouped_data}")  # Inspecciona los datos agrupados

            json_result = json.loads(grouped_data.to_json(orient='records', force_ascii=False))

            return json_result  # Asegúrate de definir json_result adecuadamente después de la agrupación
        except Exception as e:
            print(f"Error converting CSV to JSON: {e}")
            return {'error': str(e)}
