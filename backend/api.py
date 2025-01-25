
from fastapi import APIRouter, HTTPException
from typing import List
from models import *

router = APIRouter()

Hospitals = []

# Endpoint to receive building data and run the simulation
@router.post("/run-simulation", response_model=str)
async def run_simulation(buildings: List[Building]):
    if not buildings:
        raise HTTPException(status_code=400, detail="No building data provided")

    # Example simulation: Mark some buildings as infected
    HospitalNames = [Building.name for Building in buildings]
    print(HospitalNames)

    # Return the simulation results
    return "hello"