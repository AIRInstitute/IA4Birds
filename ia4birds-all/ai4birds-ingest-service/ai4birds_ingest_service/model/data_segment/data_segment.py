
import json
from datetime import datetime
from typing import Dict, Any

from ai4birds_ingest_service import logger

class DataSegment:
    def __init__(self, camera_id: int, segment_idx: str, colatitude: float, azimuth: float, zoom_level: int, average_area: float, total_big_birds: int, frames: str, received_at: str) -> None:
        self.camera_id = camera_id
        self.segment_idx = segment_idx
        self.colatitude = colatitude
        self.azimuth = azimuth
        self.zoom_level = zoom_level
        self.average_area = average_area
        self.total_big_birds = total_big_birds
        self.frames = frames
        self.received_at = received_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            'camera_id': self.camera_id,
            'segment_idx': self.segment_idx,
            'colatitude': self.colatitude,
            'azimuth': self.azimuth,
            'zoom_level': self.zoom_level,
            'average_area': self.average_area,
            'total_big_birds': self.total_big_birds,
            'frames': self.frames,
            'received_at': self.received_at.isoformat() if isinstance(self.received_at, datetime) else self.received_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'DataSegment':
        datatime = datetime.now()

        try:
            return cls(
                camera_id = data.get('camera_id', None),
                segment_idx = data.get('segment_idx', None),
                colatitude = data.get('absolute_colatitude', None),
                azimuth = data.get('absolute_azimuth', None),
                zoom_level = data.get('zoom_level', None),
                average_area = data.get('average_area', None),
                total_big_birds = data.get('total_big_birds', None),
                frames = json.dumps(data.get('frames', {})),
                received_at = datatime
            )
        except Exception as e:
            logger.error(f'Error parsing DataSegment data: {e}')
            logger.error(f'Data: {data}')
            return None