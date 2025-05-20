import re

class CoordinateExtractor:
    """
    Utility class to extract coordinates from WKT (Well-Known Text) strings.
    """

    @staticmethod
    def from_wkt(wkt_string: str):
        """
        Extracts the first three coordinates from a WKT string with polygon data.

        Args:
            :param wkt_string: geometry in WKT format.
            :type wkt_string: str

        Returns:
            A list of (latitude, longitude) tuples.
        """
        try:
            match = re.findall(r'\(\(\((.*?)\)\)\)', wkt_string, re.DOTALL)
            if not match:
                return []
            coordinates = []
            for pair in match[0].split(',')[:3]:
                lat, lon = map(float, pair.strip().split())
                coordinates.append((lon, lat))
            return coordinates
        except:
            return []