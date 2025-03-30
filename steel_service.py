# steel_service.py (FastAPI example)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from steel import Steel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STEEL_API_KEY = os.getenv('STEEL_API_KEY')
client = Steel(steel_api_key=STEEL_API_KEY)

@app.post("/create-session")
async def create_session():
    session = client.sessions.create()
    return {
        "sessionViewerUrl": session.session_viewer_url,
        "sessionId": session.id
    }