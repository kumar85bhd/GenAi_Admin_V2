from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from backend.auth.jwt import get_current_user, auth_handler
from backend.models.index import AuthUser
from backend.config import settings
import json
import os
from jose import jwt

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.get("/api/auth/config")
def get_auth_config():
    return {"mode": settings.AUTH_MODE}

@router.post("/api/auth/login")
def login(req: LoginRequest):
    users_path = os.path.join(os.getcwd(), "backend", "data", "users.json")
    try:
        with open(users_path, "r") as f:
            users = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
        
    user = next((u for u in users if u["email"] == req.email and u["password"] == req.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = jwt.encode(
        {"email": user["email"], "name": user["name"]},
        settings.JWT_SECRET,
        algorithm="HS256"
    )
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/api/auth/me")
def get_me(user: AuthUser = Depends(get_current_user)):
    return user
