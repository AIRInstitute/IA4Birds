#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests
import typing
from typing import Dict


class WindMap_Extractor():
    def windmap_ingest(self, lat: float, lon: float, z: int) -> Dict:
        """
        Processes latitude and longitude data for the extraction of wind maps.

        Args:
            :param lat: latitude of the point of interest.
            :type lat: float, required
            :param lon: Longitude of the point of interest.
            :type lon: float, required
            :param z: Altitude in meters.
            :type z: int, required

        Returns:
            :return: A dictionary containing the extracted data.
            :rtype: dict
        """

        # Imprimir los valores de latitud y longitud
        print(f"Latitud recibida: {lat}, Longitud recibida: {lon}")

        # Endpoints
        wind_profile_endpoint = f"https://www.mapaeolicoiberico.com/api/v1/meso/WIND_PROFILE/?lat={lat}&lon={lon}&z={z}"
        daily_wind_temp_endpoint = f"https://www.mapaeolicoiberico.com/api/v1/meso/WS/?lat={lat}&lon={lon}&z={z}"
        weibull_endpoint = f"https://www.mapaeolicoiberico.com/api/v1/meso/WEIBULL/?lat={lat}&lon={lon}&z={z}"
        wind_rose_endpoint = f"https://www.mapaeolicoiberico.com/api/v1/meso/WINDROSE/?lat={lat}&lon={lon}&z={z}"  # Endpoint para rosa de vientos

        # Obtener datos de los endpoints
        try:
            wind_profile_data = requests.get(wind_profile_endpoint).json()
        except Exception as e:
            print(f"Error al obtener el perfil de viento: {e}")
            wind_profile_data = None

        try:
            daily_wind_temp_data = requests.get(daily_wind_temp_endpoint).json()
        except Exception as e:
            print(f"Error al obtener datos diarios de viento y temperatura: {e}")
            daily_wind_temp_data = None

        try:
            weibull_data = requests.get(weibull_endpoint).json()
        except Exception as e:
            print(f"Error al obtener la distribución de Weibull: {e}")
            weibull_data = None

        try:
            wind_rose_data = requests.get(wind_rose_endpoint, params={"lat": lat, "lon": lon, "z": z}).json()
        except Exception as e:
            print(f"Error al obtener la rosa de vientos: {e}")
            wind_rose_data = None

        csv_file = self.download_csv(lat, lon)

        return {
            "wind_profile": wind_profile_data,
            "daily_wind_temp": daily_wind_temp_data,
            "weibull_distribution": weibull_data,
            "wind_rose": wind_rose_data,
            "csv_file": csv_file
        }
    
    def download_csv(self,lat, lon):
        """
        Download a CSV file for specific coordinates.

        Args:
            :param lat: latitude of the point of interest.
            :type lat: float, required
            :param lon: Longitude of the point of interest.
            :type lon: float, required

        Returns:
            str: Ruta del archivo CSV descargado.
        """
        url = f"https://www.mapaeolicoiberico.com/api/v1/downloadDataFree?lat={lat}&lon={lon}"
        response = requests.get(url, stream=True)

        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            # Especificar la ruta y el nombre del archivo donde se guardará el CSV
            filename = f"wind_data_{lat}_{lon}.csv"
            with open(filename, 'wb') as file:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:  # filtrar los keep-alive chunks
                        file.write(chunk)
            return filename
        else:
            print("Error en la descarga del archivo CSV.")
            return None
    

