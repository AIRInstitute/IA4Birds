class RowMapper:
    """
    Converts pandas DataFrame rows into dictionaries with required fields.
    """

    @staticmethod
    def map_row(row):
        """
        Converts a single row to dictionary format.

        Args:
            :param row: a pandas Series (row).
            :type row: pd.Series

        Returns:
            Dictionary with selected fields.
        """
        return {
            'fid': row['fid'],
            'criterio': row['criterio'],
            't_instalac': row['t_instalac'],
            'ambito': row['ambito'],
            'area_excl': row['area_excl'],
            'espacio': row['espacio'],
            'identific': row['identific'],
            'coordenadas': row['coordenadas']
        }
