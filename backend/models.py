from pydantic import BaseModel
from typing import List

# Define a Pydantic model for incoming building data
class Building(BaseModel):
    name: str
    id: str
    types: List[str]