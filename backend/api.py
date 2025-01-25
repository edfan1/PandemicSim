from fastapi import APIRouter, HTTPException
from typing import List
from .models import BuildInfo

router = APIRouter()

buildings = []

@router.post("/load_buildings")
async def load_buildings(building_data: List[BuildInfo]):
    try:
        for building in building_data:
            buildings.append(building)
        return {"message": "Buildings loaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/buildings")
async def get_buildings():
    return buildings