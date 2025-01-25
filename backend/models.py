from pydantic import BaseModel
from typing import List

# Define a Pydantic model for incoming building data
class Building(BaseModel):
    name: str
    type: List[str]  # Google Maps types (e.g., ["restaurant", "hospital"])
    latitude: float
    longitude: float