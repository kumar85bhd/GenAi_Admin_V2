from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import admin_apps, apps, auth
from backend.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(title="GenAI Workspace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin_apps.router)
app.include_router(apps.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "live": True}
