import pandas as pd
import gzip

class CSVReader:
    """
    Utility class to read CSV files, including standard and gzip-compressed formats.
    """
     
    @staticmethod
    def read_csv(filepath: str):
        """
        Reads a standard CSV file with ';' as separator.

        Args:
            :param filepath: path to the CSV file.
            :type filepath: str

        Returns:
            A pandas DataFrame containing the parsed CSV data.
        """
        return pd.read_csv(filepath, sep=';', encoding='utf-8', on_bad_lines='skip')

    @staticmethod
    def read_gzip_csv(filepath: str):
        """
        Reads a standard CSV file with ';' as separator.

        Args:
            :param filepath: path to the CSV file.
            :type filepath: str

        Returns:
            A pandas DataFrame containing the parsed CSV data.
        """
        with gzip.open(filepath, 'rt', encoding='utf-8') as f:
            return pd.read_csv(f, sep=';', on_bad_lines='skip')
