from typing import List, Dict, Any

class EBirdData:
    def __init__(self, species_code: str, com_name: str, sci_name: str, observations: List[Dict[str, Any]]):
        self.species_code = species_code
        self.com_name = com_name
        self.sci_name = sci_name
        self.observations = observations

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'EBirdData':
        return EBirdData(
            species_code=data['speciesCode'],
            com_name=data['comName'],
            sci_name=data['speciesSciName'],
            observations=data['observations']
        )
