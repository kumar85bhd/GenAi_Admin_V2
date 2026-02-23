from fastapi import APIRouter, Depends, HTTPException
from typing import List
from backend.auth.jwt import get_current_user, admin_guard
from backend.models.index import AuthUser, AppModel, AppCreate, AppUpdate
import json
import os
import uuid

router = APIRouter()

APPS_FILE = os.path.join(os.getcwd(), "backend", "data", "apps.json")

def load_apps() -> List[dict]:
    if not os.path.exists(APPS_FILE):
        return []
    try:
        with open(APPS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_apps(apps: List[dict]):
    with open(APPS_FILE, "w") as f:
        json.dump(apps, f, indent=2)

@router.get("/admin/apps", response_model=List[AppModel])
def get_admin_apps(user: AuthUser = Depends(admin_guard)):
    apps = load_apps()
    return apps

@router.post("/admin/apps", response_model=AppModel)
def create_app(app_in: AppCreate, user: AuthUser = Depends(admin_guard)):
    apps = load_apps()
    
    # Check uniqueness
    for a in apps:
        if a["name"].lower() == app_in.name.lower():
            raise HTTPException(status_code=409, detail="App name already exists")
        if a["route"] == app_in.route:
            raise HTTPException(status_code=409, detail="App route already exists")
            
    new_app = {
        "id": str(uuid.uuid4()),
        "name": app_in.name,
        "description": app_in.description,
        "category": app_in.category,
        "route": app_in.route,
        "isActive": app_in.isActive
    }
    apps.append(new_app)
    save_apps(apps)
    return new_app

@router.put("/admin/apps/{app_id}", response_model=AppModel)
def update_app(app_id: str, app_in: AppUpdate, user: AuthUser = Depends(admin_guard)):
    apps = load_apps()
    
    app_idx = next((i for i, a in enumerate(apps) if a["id"] == app_id), None)
    if app_idx is None:
        raise HTTPException(status_code=404, detail="App not found")
        
    # Check uniqueness
    for i, a in enumerate(apps):
        if i != app_idx:
            if app_in.name and a["name"].lower() == app_in.name.lower():
                raise HTTPException(status_code=409, detail="App name already exists")
            if app_in.route and a["route"] == app_in.route:
                raise HTTPException(status_code=409, detail="App route already exists")
                
    app = apps[app_idx]
    if app_in.name is not None:
        app["name"] = app_in.name
    if app_in.description is not None:
        app["description"] = app_in.description
    if app_in.category is not None:
        app["category"] = app_in.category
    if app_in.route is not None:
        app["route"] = app_in.route
    if app_in.isActive is not None:
        app["isActive"] = app_in.isActive
        
    apps[app_idx] = app
    save_apps(apps)
    return app

@router.delete("/admin/apps/{app_id}")
def delete_app(app_id: str, user: AuthUser = Depends(admin_guard)):
    apps = load_apps()
    app_idx = next((i for i, a in enumerate(apps) if a["id"] == app_id), None)
    if app_idx is None:
        raise HTTPException(status_code=404, detail="App not found")
        
    apps.pop(app_idx)
    save_apps(apps)
    return {"status": "success"}
