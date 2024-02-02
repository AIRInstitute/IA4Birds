#!/usr/bin/python3
# Copyright 2023 AIRInstitute
# See LICENSE for details.
# Author: AIRInstitute (@AIRInstitute on GitHub)

import requests
import zipfile
import os
from ai4birds_ingest_service.log import logger

class ExclusionMap_extractor():
    @staticmethod
    def exclusionMap_ingest():
        """
        Queries the idecyl API to retrieve eolic exclusion map data in SHP format.

        Args:
            None

        Returns:
            None
        """
        # Endpoint
        exclusion_map_endpoint = "https://idecyl.jcyl.es/geoserver/er/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=er:enre_cyl_excl_eoli&srsName=EPSG:25830&outputFormat=SHAPE-ZIP"
        
        # Get data from the endpoint
        try:
            response = requests.get(exclusion_map_endpoint)        
        except Exception as e:
            logger.error(f"Error while downloading *.zip file: {e}")
            return None

        if response.status_code == 200:
            # Save the file
            zip_filename = "file.zip"
            with open(zip_filename, 'wb') as f:
                f.write(response.content)
        else:
            logger.error(f"Error while downloading *.zip file: {e}")
            return None
        
        # Extract the file
        with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
            shp_files = [file for file in zip_ref.namelist() if file.endswith('.shp')]

            if shp_files:
                # Extract the first .shp file
                shp_file = shp_files[0]
                zip_ref.extract(shp_file)
            else:
                logger.error("Error decompressing the shp file: No .shp files found in the ZIP.")
        # Remove the .zip file
        os.remove(zip_filename)
        logger.info("Exclusion map file downloaded successfully.")

        return None



