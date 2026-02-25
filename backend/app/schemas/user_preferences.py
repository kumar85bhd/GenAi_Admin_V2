from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import uuid

class UserPreferenceBase(BaseModel):
    theme: str = Field(default="dark")
    favorites: List[int] = Field(default_factory=list)

class UserPreferenceCreate(UserPreferenceBase):
    pass

class UserPreferenceUpdateTheme(BaseModel):
    theme: str

    @validator('theme')
    def theme_must_be_light_or_dark(cls, v):
        if v not in ('light', 'dark'):
            raise ValueError('Theme must be light or dark')
        return v

class UserPreferenceUpdateFavorites(BaseModel):
    favorites: List[int]

    @validator('favorites')
    def favorites_must_be_unique(cls, v):
        if len(v) != len(set(v)):
            raise ValueError('Favorites must be unique')
        return v

class UserPreferenceResponse(UserPreferenceBase):
    id: uuid.UUID
    email: str
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
