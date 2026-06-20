from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.crud.user import (
    get_user_by_email,
    create_user,
    authenticate_user,
)
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.core.config import settings


router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.
    Checks if email already exists before creating.
    """
    
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please login or use a different email."
        )

    
    if len(user_data.name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name must be at least 2 characters long."
        )

    
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )

    
    new_user = create_user(db, user_data)
    return new_user



@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password.
    Returns JWT token if credentials are correct.
    """
    # Verify email + password
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Contact support."
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),   
            "role": user.role,       
        },
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    """
    Returns the currently logged in user.
    Validates JWT token automatically via dependency.
    """
    return current_user