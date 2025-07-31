
import json
from datetime import datetime
from typing import Dict, Any

from ai4birds_ingest_service import logger

class BirdStatistics:
    def __init__(self, camera_id: int, bird_name: str, count:int, last_seen: str, created_at: str) -> None:
        self.camera_id = camera_id
        self.bird_name = bird_name
        self.count = count
        self.last_seen = last_seen
        self.created_at = created_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            'camera_id': self.camera_id,
            'bird_name': self.bird_name,
            'count': self.count,
            'last_seen': self.last_seen.isoformat() if isinstance(self.last_seen, datetime) else self.last_seen,
            'created_at': self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

    @classmethod
    def from_dict(cls, camera_id:str, data: Dict[str, Any]) -> 'BirdStatistics':
        datatime = datetime.now()

        try:
            return cls(
                camera_id = camera_id,
                bird_name = data.get('bird_name', None),
                count = data.get('count', None),
                last_seen = data.get('last_seen', None),
                created_at = datatime
            )
        except Exception as e:
            logger.error(f'Error parsing BirdStatistics data: {e}')
            logger.error(f'Data: {data}')
            return None