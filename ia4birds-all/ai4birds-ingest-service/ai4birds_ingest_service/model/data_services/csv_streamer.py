from .reader import CSVReader
from .cleaner import DataCleaner
from .coordinate_extractor import CoordinateExtractor
from .row_mapper import RowMapper

class CSVStreamer:
    """
    Generator service that streams CSV data in chunks.
    """

    def stream(self, filepath: str, page_size: int = 50):
        """
        Reads and cleans CSV data, extracts coordinates, and yields data chunks.

        Args:
            :param filepath: path to the CSV file.
            :type filepath: str
            :param page_size: number of records per batch.
            :type page_size: int

        Yields:
            List of dictionaries representing CSV data in batches.
        """
        df = CSVReader.read_csv(filepath)
        df = DataCleaner.clean_invalid_characters(df)
        df['identific'] = df['identific'].fillna('null').str.replace('"', '')
        df['coordenadas'] = df['WKT'].apply(CoordinateExtractor.from_wkt)

        for start in range(0, len(df), page_size):
            end = start + page_size
            batch = df.iloc[start:end]
            yield batch.apply(RowMapper.map_row, axis=1).tolist()
