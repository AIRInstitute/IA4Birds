
from datetime import datetime, timezone
from typing import List, Dict, Any

class DataCombination:
    def __init__(self, species_id: int, com_name: str, sci_name: str, observations: List[Dict[str, Any]], recordings: List[Dict[str, Any]]) -> None:
        self.species_id = species_id
        self.com_name = com_name
        self.sci_name = sci_name
        self.observations = observations
        self.recordings = recordings

    def to_dict(self) -> Dict[str, Any]:
        return {
            'species_id': self.species_id,
            'com_name': self.com_name,
            'sci_name': self.sci_name,
            'observations': self.observations,
            'recordings': self.recordings
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'DataCombination':
        return DataCombination(
            species_id=data['species_id'],
            com_name=data['com_name'],
            sci_name=data['sci_name'],
            observations=data['observations'],
            recordings=data['recordings']
        )
