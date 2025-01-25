from pydantic import BaseModel
from typing import List

class BuildInfo(BaseModel):
    id: str
    name: str
    types: List[str]