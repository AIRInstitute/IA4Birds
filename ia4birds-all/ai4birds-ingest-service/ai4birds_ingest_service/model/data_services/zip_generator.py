import tempfile
import zipfile
import os
import json

class ZipGenerator:
    """
    Service to create a ZIP archive containing a JSON file from a data dictionary.
    """

    @staticmethod
    def json_to_zip(data: dict, json_filename='data.json') -> str:
        """
        Converts the data dictionary to JSON, writes it to a temporary file,
        and compresses it into a ZIP archive.

        Args:
            :param data: dictionary containing the JSON serializable data.
            :type data: dict
            :param json_filename: name of the JSON file inside the ZIP.
            :type json_filename: str

        Returns:
            Path to the created ZIP file.
        """
        # Write JSON to a temp file
        fd_json, path_json = tempfile.mkstemp(suffix='.json')
        with os.fdopen(fd_json, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        # Create ZIP containing the JSON
        fd_zip, path_zip = tempfile.mkstemp(suffix='.zip')
        with zipfile.ZipFile(path_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(path_json, arcname=json_filename)

        # Clean up JSON temp file
        os.remove(path_json)
        return path_zip