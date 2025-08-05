import os
import mimetypes
from flask import Response, send_file
from ai4birds_ingest_service import config, logger

class HeatmapFilesService:
    """Service for handling heatmap files operations."""
    
    def __init__(self):
        # Directorio donde se almacenan las imágenes de mapas de calor
        self.heatmaps_directory = '/app/ai4birds_ingest_service/heatmaps'
        logger.info(f"Initialized HeatmapFilesService with directory: {self.heatmaps_directory}")
        logger.info(f"Directory exists: {os.path.exists(self.heatmaps_directory)}")
        logger.info(f"Is directory: {os.path.isdir(self.heatmaps_directory)}")
        if os.path.exists(self.heatmaps_directory):
            logger.info(f"Contents: {os.listdir(self.heatmaps_directory)}")
        
    def get_heatmap_file_response(self, filename: str):
        """Get heatmap file as HTTP response for direct file serving.
        
        Args:
            filename (str): Name of the heatmap file
            
        Returns:
            Flask Response: File response or error response
        """
        logger.info(f"Requesting heatmap file response: {filename}")
        
        try:
            # Validar que el archivo existe
            if not self._file_exists(filename):
                logger.warning(f"Heatmap file not found: {filename}")
                return Response("File not found", status=404)
            
            # Validar que es una imagen válida
            if not self._is_valid_image_file(filename):
                logger.warning(f"Invalid file type requested: {filename}")
                return Response("Invalid file type. Only image files are allowed", status=400)
            
            # Servir el archivo directamente
            file_path = os.path.join(self.heatmaps_directory, filename)
            
            # Obtener el tipo MIME
            mime_type, _ = mimetypes.guess_type(filename)
            if not mime_type:
                mime_type = 'application/octet-stream'
            
            logger.info(f"Serving heatmap file response: {filename}")
            return send_file(
                file_path,
                mimetype=mime_type,
                as_attachment=False,
                download_name=filename
            )
            
        except Exception as e:
            logger.error(f"Error serving heatmap file response {filename}: {e}")
            return Response(f"Internal server error: {str(e)}", status=500)
    
    def _file_exists(self, filename: str) -> bool:
        """Check if file exists in heatmaps directory.
        
        Args:
            filename (str): Name of the file to check
            
        Returns:
            bool: True if file exists, False otherwise
        """
        file_path = os.path.join(self.heatmaps_directory, filename)
        return os.path.isfile(file_path)
    
    def _is_valid_image_file(self, filename: str) -> bool:
        """Check if file has a valid image extension.
        
        Args:
            filename (str): Name of the file to check
            
        Returns:
            bool: True if file has valid image extension, False otherwise
        """
        valid_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'}
        file_extension = os.path.splitext(filename.lower())[1]
        return file_extension in valid_extensions
    
    def list_heatmap_files(self):
        """List all available heatmap files.
        
        Returns:
            tuple: List of files and status code
        """
        logger.info("Listing all heatmap files")
        
        try:
            if not os.path.exists(self.heatmaps_directory):
                logger.warning("Heatmaps directory does not exist")
                return {"files": [], "message": "Heatmaps directory not found"}, 404
            
            files = []
            for filename in os.listdir(self.heatmaps_directory):
                file_path = os.path.join(self.heatmaps_directory, filename)
                if os.path.isfile(file_path) and self._is_valid_image_file(filename):
                    files.append({
                        "filename": filename,
                        "size": os.path.getsize(file_path),
                        "modified": os.path.getmtime(file_path)
                    })
            
            logger.info(f"Found {len(files)} heatmap files")
            return {"files": files, "count": len(files)}, 200
            
        except Exception as e:
            logger.error(f"Error listing heatmap files: {e}")
            return {"error": f"Failed to list files: {str(e)}"}, 500