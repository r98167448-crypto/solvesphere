from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ai

app = FastAPI(
    title="SolveSphere AI Service",
    description="Microservice for NLP classification, priority scoring, duplicate detection, and expertise matching",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)

@app.get("/")
def health():
    return {"status": "online", "service": "SolveSphere AI Microservice"}
