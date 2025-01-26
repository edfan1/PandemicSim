from pydantic import BaseModel
from typing import List, Dict

# Define a Pydantic model for incoming building data
class Building(BaseModel):
    name: str
    building_id: str
    types: List[str]