from fastapi import APIRouter, Depends
from typing import List
from backend.auth.jwt import get_current_user
from backend.models.index import AuthUser
from backend.routes.admin_apps import load_apps

router = APIRouter()

# Mock favorites for now, or store in memory
favorites_db = set(["1", "2", "3", "12"])

@router.get("/apps")
def get_apps(user: AuthUser = Depends(get_current_user)):
    apps = load_apps()
    active_apps = [a for a in apps if a.get("isActive", True)]
    
    # Map to frontend AppData schema
    result = []
    for app in active_apps:
        app_id = str(app["id"])
        result.append({
            "id": app_id,
            "name": app["name"],
            "desc": app.get("description", ""),
            "category": app.get("category", "Uncategorized"),
            "isFavorite": app_id in favorites_db,
            "baseActivity": "Active",
            "icon": "Box", # Default icon
            "url": app.get("route", "#"),
            "metrics": "N/A",
            "status": "Active",
            "lastUsed": "Recently"
        })
    return result

@router.post("/apps/{app_id}/favorite")
def toggle_favorite(app_id: str, user: AuthUser = Depends(get_current_user)):
    if app_id in favorites_db:
        favorites_db.remove(app_id)
        action = "removed"
    else:
        favorites_db.add(app_id)
        action = "added"
    
    return {"status": "success", "action": action, "isFavorite": app_id in favorites_db}
