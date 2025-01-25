
from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models import *
from sim import *

router = APIRouter()

# Endpoint to receive building data and run the simulation
@router.post("/run-simulation", response_model=str)
async def run_simulation(building_types: Dict[str, List[Building]]):
    if not building_types:
        raise HTTPException(status_code=400, detail="No building data provided")

    for building_type, buildings in building_types.items():
        for building in buildings:
            construct_building(building_type, building.building_id)
    # Return the simulation results
    return "hello"

@router.post("/tick")
async def tick():
    return {'time': update_city(), 'building_counts': get_building_counts()}