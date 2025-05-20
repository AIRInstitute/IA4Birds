from .reader import CSVReader
from .cleaner import DataCleaner
from .coordinate_extractor import CoordinateExtractor
from .paginator import Paginator
from .row_mapper import RowMapper

class CSVToJsonService:
    """
    Service that orchestrates CSV-to-JSON conversion with cleaning, coordinate parsing, and pagination.
    """

    def convert(self, filepath: str, page: int = 1, page_size: int = 10):
        """
        Main method to read, clean, extract, and paginate CSV data.

        Args:
            :param filepath: path to the CSV file.
            :type filepath: str
            :param page: page number to return.
            :type page: int
            :param page_size: number of entries per page.
            :type page_size: int

        Returns:
            Dictionary with paginated data and metadata.
        """
        df = CSVReader.read_csv(filepath)
        df = DataCleaner.clean_invalid_characters(df)
        df['identific'] = df['identific'].fillna('null').str.replace('"', '')
        df['coordenadas'] = df['WKT'].apply(CoordinateExtractor.from_wkt)

        data_list = df.apply(RowMapper.map_row, axis=1).tolist()
        return Paginator.paginate(data_list, page_size, page)
