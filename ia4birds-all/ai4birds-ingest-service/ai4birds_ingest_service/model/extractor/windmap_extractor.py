#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests
import typing
from functools import lru_cache
from typing import Dict
from ai4birds_ingest_service.log import logger

class WindMap_Extractor():
    @lru_cache(maxsize=128)
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

        # Endpoints
        BASE_URL = "https://www.mapaeolicoiberico.com/api/v1/meso"
        wind_profile_endpoint = f"{BASE_URL}/WIND_PROFILE/?lat={lat}&lon={lon}&z={z}"
        daily_wind_temp_endpoint = f"{BASE_URL}/WS/?lat={lat}&lon={lon}&z={z}"
        weibull_endpoint = f"{BASE_URL}/WEIBULL/?lat={lat}&lon={lon}&z={z}"
        wind_rose_endpoint = f"{BASE_URL}/WINDROSE/?lat={lat}&lon={lon}&z={z}"

        # Get data from endpoints
        try:
            wind_profile_data = requests.get(wind_profile_endpoint).json()
        except Exception as e:
            logger.error(f"Error while retrieving wind profile: {e}")
            wind_profile_data = None

        try:
            daily_wind_temp_data = requests.get(daily_wind_temp_endpoint).json()
        except Exception as e:
            logger.error(f"Error while retrieving daily wind and temperature data: {e}")
            daily_wind_temp_data = None

        try:
            weibull_data = requests.get(weibull_endpoint).json()
        except Exception as e:
            logger.error(f"Error while retrieving Weibull distribution data: {e}")
            weibull_data = None

        try:
            wind_rose_data = requests.get(wind_rose_endpoint, params={"lat": lat, "lon": lon, "z": z}).json()
        except Exception as e:
            logger.error(f"Error while retrieving wind rose data: {e}")
            wind_rose_data = None

        csv_file = self.download_csv(lat, lon)

        return {
            "wind_profile": wind_profile_data,
            "daily_wind_temp": daily_wind_temp_data,
            "weibull_distribution": weibull_data,
            "wind_rose": wind_rose_data,
            "csv_file": csv_file
        }
    
    def download_csv(self,lat: float, lon: float) -> str:
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
        URL = f"https://www.mapaeolicoiberico.com/api/v1/downloadDataFree?lat={lat}&lon={lon}"
        response = requests.get(URL, stream=True)

        # Check request status
        if response.status_code == 200:
            # Save the file in csv format
            filename = f"wind_data_{lat}_{lon}.csv"
            with open(filename, 'wb') as file:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:  # filter out keep-alive new chunks
                        file.write(chunk)
            return filename
        else:
            logger.error(f"Error while downloading CSV file: {response.status_code}")
            return None
    

