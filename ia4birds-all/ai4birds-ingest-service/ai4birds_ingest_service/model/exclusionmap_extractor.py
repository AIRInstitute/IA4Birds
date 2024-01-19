#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests
import zipfile
import os


class ExclusionMap_extractor():
    def exclusionMap_ingest(self):
        
        """
        Queries the idecyl API to retrieve eolic exclusion map data in SHP format.

        Args:
            None

        Returns:
            None
        """
        # Endpoint
        exclusion_map_endpoint = "https://idecyl.jcyl.es/geoserver/er/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=er:enre_cyl_excl_eoli&srsName=EPSG:25830&outputFormat=SHAPE-ZIP"
        
        # Obtener datos de los endpoints
        try:
            response = requests.get(exclusion_map_endpoint)        
        except Exception as e:
            print(f"Error al realizar descarga de fichero *.zip: {e}")
            return None

        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            # Especificar la ruta y el nombre del archivo donde se guardará temporalmente el ZIP
            zip_filename = "file.zip"
            with open(zip_filename, 'wb') as f:
                f.write(response.content)
        else:
            print("Error en la descarga del archivo *.zip")
            return None
        
        # Descomprimir solo el archivo SHP del ZIP
        with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
            shp_files = [file for file in zip_ref.namelist() if file.endswith('.shp')]

            if shp_files:
                # Seleccionar el primer archivo SHP encontrado
                shp_file = shp_files[0]
                zip_ref.extract(shp_file)
                print(f'Archivo {shp_file} extraído exitosamente.')
            else:
                print("No se encontraron archivos .shp en el ZIP.")
        # Eliminar ZIP
        os.remove(zip_filename)
        print('Descarga de fichero *.shp completada')

        return None



