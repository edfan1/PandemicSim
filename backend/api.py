
from fastapi import APIRouter, HTTPException
from typing import List
from models import *

router = APIRouter()

# Endpoint to receive building data and run the simulation
@router.post("/run-simulation", response_model=str)
async def run_simulation(buildings: List[Building]):
    if not buildings:
        raise HTTPException(status_code=400, detail="No building data provided")

    # Example simulation: Mark some buildings as infected
    print("hello")

    # Return the simulation results
    return "hello"