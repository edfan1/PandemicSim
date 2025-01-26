from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models import *
from city import City
from tempsim import run_test_sim

router = APIRouter()
city = City()

# Endpoint to receive building data and run the simulation
@router.post("/run-simulation", response_model=str)
async def run_simulation(building_types: Dict[str, List[Building]]):
    city = City()
    if not building_types:
        raise HTTPException(status_code=400, detail="No building data provided")

    for building_type, buildings in building_types.items():
        if building_type == 'home':
            for building in buildings:
                if 'apartment_building' or 'housing_complex' in building.types:
                    city.add_appartment(building.building_id, 50)
                else:
                    city.add_complex(building.building_id, 75)
        else:
            for building in buildings:
                city.construct_building(building_type, building.building_id)
    # Return the simulation results
    return "Success"

@router.post("/tick")
async def tick():
    return {'time': city.update_city(), 'building_counts': city.get_building_counts()}