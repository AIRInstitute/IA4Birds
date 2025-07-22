
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
            'generated_at': self.generated_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any], image_bytes: bytes) -> 'DataHeatmap':
        datatime = datetime.now()

        try:
            camera_id = data.get('camera_id', 'Unknown')
            heatmap_for = data.get('heatmap_for', 'Unknown')

            #determine the root path of the project
            project_root = './ai4birds_ingest_service/'
            heatmap_dir = os.path.join(project_root, "heatmaps")
            os.makedirs(heatmap_dir, exist_ok=True)
            
            timestamp = datatime.strftime('%Y%m%d_%H%M%S')
            filename = f"{camera_id}_{heatmap_for}_{timestamp}.png"

            # Path
            image_abs_path = os.path.join(heatmap_dir, filename)
            image_rel_path = os.path.relpath(image_abs_path, start=project_root)

            # Save image
            with open(image_abs_path, 'wb') as f:
                f.write(image_bytes)
            
            logger.info(f"Image successfully saved to: {image_abs_path}")

            return cls(
                camera_id = camera_id,
                heatmap_for = heatmap_for,
                image_url = image_rel_path,
                generated_at = datatime
            )
        
        except Exception as e:
            logger.error(f'Error parsing DataHeatmap data: {e}')
            logger.error(f'Data: {data}')
            return None