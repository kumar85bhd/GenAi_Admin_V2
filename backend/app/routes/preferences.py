from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.schemas.user_preferences import UserPreferenceResponse, UserPreferenceUpdateTheme, UserPreferenceUpdateFavorites
from backend.app.services import preferences_service
from backend.auth.dependencies import get_current_user, User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("", response_model=UserPreferenceResponse)
def get_preferences(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return preferences_service.get_or_create_preferences(db, current_user.email)
    except Exception as e:
        logger.error(f"Error fetching preferences: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.put("/theme", response_model=UserPreferenceResponse)
def update_theme(theme_update: UserPreferenceUpdateTheme, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return preferences_service.update_theme(db, current_user.email, theme_update)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating theme: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.put("/favorites", response_model=UserPreferenceResponse)
def update_favorites(favorites_update: UserPreferenceUpdateFavorites, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return preferences_service.update_favorites(db, current_user.email, favorites_update)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating favorites: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
