from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
import json

from backend.config import config

class User(BaseModel):
    email: str
    name: str
    roles: list[str]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_public_key():
    try:
        with open(config.JWT_PUBLIC_KEY_PATH, "r") as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Public key file not found.",
        )

PUBLIC_KEY = get_public_key()

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=[config.JWT_ALGORITHM],
            issuer=config.JWT_ISSUER,
            audience=config.JWT_AUDIENCE,
        )
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Check if user is an admin
    with open("backend/data/admin_users.json") as f:
        admin_users = json.load(f)["admins"]

    roles = ["user"]
    if email in admin_users:
        roles.append("admin")

    return User(email=email, name=payload.get("name", ""), roles=roles)

def admin_guard(user: User = Depends(get_current_user)):
    if "admin" not in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource.",
        )
    return user
