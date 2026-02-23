from pydantic import BaseModel, Field, constr
from typing import List, Optional
import uuid

class AuthUser(BaseModel):
    email: str
    name: Optional[str] = None
    roles: List[str] = ["user"]
    is_admin: bool = False

class AppModel(BaseModel):
    id: uuid.UUID
    name: str = Field(..., pattern=r"^[a-zA-Z0-9_-]+$")
    description: str
    category: str
    route: str
    isActive: bool

class AppCreate(BaseModel):
    name: str = Field(..., pattern=r"^[a-zA-Z0-9_-]+$")
    description: str
    category: str
    route: str
    isActive: bool

class AppUpdate(BaseModel):
    name: Optional[str] = Field(None, pattern=r"^[a-zA-Z0-9_-]+$")
    description: Optional[str] = None
    category: Optional[str] = None
    route: Optional[str] = None
    isActive: Optional[bool] = None
