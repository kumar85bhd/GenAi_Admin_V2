from fastapi import APIRouter, Depends
from backend.auth.dependencies import get_current_user, User

router = APIRouter()

@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
