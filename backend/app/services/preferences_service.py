from sqlalchemy.orm import Session
from backend.app.models.user_preferences import UserPreference
from backend.app.schemas.user_preferences import UserPreferenceUpdateTheme, UserPreferenceUpdateFavorites
import logging

logger = logging.getLogger(__name__)

def get_or_create_preferences(db: Session, email: str) -> UserPreference:
    pref = db.query(UserPreference).filter(UserPreference.email == email).first()
    if not pref:
        logger.info(f"Creating default preferences for user {email}")
        pref = UserPreference(email=email, theme="dark", favorites=[])
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref

def update_theme(db: Session, email: str, theme_update: UserPreferenceUpdateTheme) -> UserPreference:
    pref = get_or_create_preferences(db, email)
    pref.theme = theme_update.theme
    db.commit()
    db.refresh(pref)
    return pref

def update_favorites(db: Session, email: str, favorites_update: UserPreferenceUpdateFavorites) -> UserPreference:
    pref = get_or_create_preferences(db, email)
    pref.favorites = favorites_update.favorites
    db.commit()
    db.refresh(pref)
    return pref
