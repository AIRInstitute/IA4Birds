from typing import List, Dict, Any

class XenoCantoData:
    def __init__(self, species_sci_name: str, recordings: List[Dict[str, Any]]):
        self.species_sci_name = species_sci_name
        self.recordings = recordings

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'XenoCantoData':
        return XenoCantoData(
            species_sci_name=data['speciesSciName'],
            recordings=data['recordings']
        )
