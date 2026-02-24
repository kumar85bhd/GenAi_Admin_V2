from fastapi import APIRouter, Depends
from backend.auth.dependencies import admin_guard

router = APIRouter()

@router.get("/config")
def get_config(user=Depends(admin_guard)):
    return {"message": "Welcome to the admin config!"}

@router.get("/health")
def get_health(user=Depends(admin_guard)):
    return {"status": "ok"}
