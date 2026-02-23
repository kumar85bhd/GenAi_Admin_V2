import json
import os
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from backend.config import settings
from backend.models.index import AuthUser
from backend.utils.logger import get_logger

logger = get_logger(__name__)
security = HTTPBearer()

class AuthHandler:
    def __init__(self):
        self.public_key = None
        if settings.AUTH_MODE == "sso":
            if not settings.JWT_PUBLIC_KEY_PATH:
                raise ValueError("JWT_PUBLIC_KEY_PATH is required when AUTH_MODE is set to sso")
            try:
                with open(settings.JWT_PUBLIC_KEY_PATH, "r") as f:
                    self.public_key = f.read()
            except Exception as e:
                logger.error(f"Failed to load public key: {e}")
                raise e

    def decode_token(self, token: str) -> AuthUser:
        try:
            if settings.AUTH_MODE == "sso":
                options = {}
                if settings.JWT_ISSUER:
                    options["issuer"] = settings.JWT_ISSUER
                if settings.JWT_AUDIENCE:
                    options["audience"] = settings.JWT_AUDIENCE
                
                payload = jwt.decode(
                    token,
                    self.public_key,
                    algorithms=[settings.JWT_ALGORITHM],
                    **options
                )
            else:
                payload = jwt.decode(
                    token,
                    settings.JWT_SECRET,
                    algorithms=["HS256"]
                )
            
            email = payload.get("email")
            if not email:
                raise HTTPException(status_code=401, detail="Token missing email claim")
            
            return AuthUser(
                email=email,
                name=payload.get("name"),
                roles=["user"],
                is_admin=False
            )
        except JWTError as e:
            logger.warning(f"JWT verification failed: {e}")
            raise HTTPException(status_code=401, detail="Invalid token")

auth_handler = AuthHandler()

class AdminResolver:
    def __init__(self):
        self.admin_emails = set()
        self.load_admins()

    def load_admins(self):
        config_path = os.path.join(os.getcwd(), "backend", "data", "admin_users.json")
        try:
            if os.path.exists(config_path):
                with open(config_path, "r") as f:
                    data = json.load(f)
                    admins = data.get("admins", [])
                    for email in admins:
                        self.admin_emails.add(email.lower().strip())
            else:
                logger.warning("admin_users.json not found, skipping admin resolution")
        except Exception as e:
            logger.error(f"Failed to load admin_users.json: {e}")

    def resolve(self, user: AuthUser) -> AuthUser:
        if user.email and user.email.lower().strip() in self.admin_emails:
            user.is_admin = True
            if "admin" not in user.roles:
                user.roles.append("admin")
        return user

admin_resolver = AdminResolver()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthUser:
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    user = admin_resolver.resolve(user)
    return user

def admin_guard(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if not user.is_admin:
        logger.warning(f"Admin access attempt by non-admin user: {user.email}")
        raise HTTPException(status_code=403, detail="Forbidden")
    return user
