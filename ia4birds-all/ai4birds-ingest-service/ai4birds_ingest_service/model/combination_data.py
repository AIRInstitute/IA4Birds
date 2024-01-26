class CombinerDataBird:
    def combine_data(self,data_ebird, data_xenocanto) -> list:
        """
        Combines bird observation data from eBird and recording data from Xeno-Canto.

        Args:
            :param data_ebird: List of bird observation data from the eBird API.
            :type data_ebird: list, required
            :param data_xenocanto: List of bird recording data from the Xeno-Canto API.
            :type data_xenocanto: list, required

        Returns:
            :return: A list of combined bird data, each entry containing observations and recordings for a particular species.
            :rtype: list
        """
        
        combinado = []

        # Indexar los datos de XenoCanto por nombre científico
        xenocanto_por_especie = {grabacion['speciesSciName']: grabacion for grabacion in data_xenocanto}

        # Iterar sobre los datos de eBird
        for observacion in data_ebird:
            especie = observacion['speciesSciName']
            grabaciones = xenocanto_por_especie.get(especie, {}).get('recordings', [])

            registro_combinado = {
                "speciesCode": observacion.get('speciesCode'),
                "comName": observacion.get('comName'),
                "sciName": especie,
                "observations": observacion.get('observations', []),
                "recordings": grabaciones
            }
            combinado.append(registro_combinado)

        return combinado