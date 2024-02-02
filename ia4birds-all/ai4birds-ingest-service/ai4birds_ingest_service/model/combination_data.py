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
            # Agrupar todas las grabaciones de la misma especie en el mismo elemento
            if grabaciones:
                grabaciones_totales = [registro_combinado['recordings'] for registro_combinado in combinado if registro_combinado['sciName'] == especie]
                grabaciones_totales.append(grabaciones)
                registro_combinado['recordings'] = [item for sublist in grabaciones_totales for item in sublist]
            
            combinado.append(registro_combinado)

        
        # Iterar sobre los datos de XenoCanto
        for especie, grabacion in xenocanto_por_especie.items():
            if especie not in [obs['sciName'] for obs in combinado]:
                registro_combinado = {
                    "speciesCode": grabacion.get('speciesCode'),
                    "comName": grabacion.get('comName'),
                    "sciName": grabacion.get('sciName'),
                    "observations": [],
                    "recordings": grabacion.get('recordings', [])
                }
                combinado.append(registro_combinado)

        return combinado