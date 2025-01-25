from fastapi import FastAPI
from .api import router

app = FastAPI()

# Include the routes from api.py
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)