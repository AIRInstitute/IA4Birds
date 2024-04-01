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
        # Asumiendo que 'coordinates' es ahora una lista de tuplas de coordenadas para un 'identific' específico
        if len(coordinates) > 1:
            # Ordenar por latitud (norte a sur) y luego por longitud (oeste a este) y deduplicar
            sorted_coords = sorted(set(coordinates), key=lambda x: (-x[0], x[1]))
            return sorted_coords
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
            # Crea un DataFrame con una columna para 'identific' y otra para las coordenadas
            clean_data['coordenadas'] = list(zip(clean_data['Latitud'], clean_data['Longitud']))

            # Agrupa por 'identific' y aplica la función para ordenar y deduplicar coordenadas
            def aggregate_and_sort_rows(group):
                # Extracción de todas las coordenadas para el grupo actual
                all_coords = group['coordenadas'].tolist()
                sorted_and_deduped_coords = DataConverter.sort_and_deduplicate_coordinates(all_coords)

                # Asumiendo que todos los otros campos son iguales para el mismo 'identific',
                # toma el primer valor para cada uno de ellos
                return pd.Series({
                    'fid': group['fid'].iloc[0],
                    'criterio': group['criterio'].iloc[0],
                    't_instalac': group['t_instalac'].iloc[0],
                    'ambito': group['ambito'].iloc[0],
                    'area_excl': group['area_excl'].iloc[0],
                    'espacio': group['espacio'].iloc[0],
                    'coordenadas': sorted_and_deduped_coords  # Esta es la lista de coordenadas ordenadas y deduplicadas
                })

            # Aplica la función de agregación a cada grupo y resetea el índice para volver a un DataFrame
            grouped_data = clean_data.groupby('identific').apply(aggregate_and_sort_rows).reset_index()
            print(f"Grouped data: {grouped_data}")

            # Convierte el DataFrame agrupado a JSON
            json_result = json.loads(grouped_data.to_json(orient='records', force_ascii=False))

            return json_result
        except Exception as e:
            print(f"Error converting CSV to JSON: {e}")
            return {'error': str(e)}
