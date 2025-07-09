
import os
import base64

from datetime import datetime
from typing import Dict, Any

from ai4birds_ingest_service import logger

class DataHeatmap:
    def __init__(self, camera_id: int, heatmap_for: str, image_url: str, generated_at: str) -> None:
        self.camera_id = camera_id
        self.heatmap_for = heatmap_for
        self.image_url = image_url
        self.generated_at = generated_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            'camera_id': self.camera_id,
            'heatmap_for': self.heatmap_for,
            'image_url': self.image_url,
            'image_blob': self.image_blob,
            'generated_at': self.generated_at
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'DataHeatmap':
        datatime = datetime.now()

        try:
            image_b64 = data.get('image_blob')
            camera_id = data.get('camera_id', 'Unknown')
            heatmap_for = data.get('heatmap_for', 'Unknown')

            if not image_b64:
                logger.warning('Missing image_blob in DataHeatmap data')
                return None
            
            timestamp = datatime.strftime('%Y%m%d_%H%M%S')
            filename = f"{camera_id}_{heatmap_for}_{timestamp}.png"

            # Path
            project_root = os.getcwd()
            heatmap_dir = os.path.join(project_root, "ai4birds_ingest_service", "heatmaps")
            os.makedirs(heatmap_dir, exist_ok=True)

            image_abs_path = os.path.join(heatmap_dir, filename)
            image_rel_path = os.path.relpath(image_abs_path, start=project_root)

            # Secure directory
            os.makedirs(os.path.dirname(image_abs_path), exist_ok=True)

            # Save image
            with open(image_abs_path, 'wb') as f:
                f.write(base64.b64decode(image_b64))
            
            logger.info(f"Image successfully saved to: {image_abs_path}")

            return DataHeatmap(
                camera_id = camera_id,
                heatmap_for = heatmap_for,
                image_url = image_rel_path,
                generated_at = datatime
            )
        
        except Exception as e:
            logger.error(f'Error parsing DataHeatmap data: {e}')
            logger.error(f'Data: {data}')
            return None