from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserResponse, UserUpdate, PasswordChange
from app.crud.user import (
    update_user,
    update_password,
    authenticate_user,
    get_user_by_email,
)
from app.core.dependencies import get_current_user
from app.core.security import verify_password

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user=Depends(get_current_user)):
    """
    Get the profile of the currently logged in user.
    Requires JWT token in Authorization header.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    update_data: UserUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the profile of the currently logged in user.
    Only name and email can be updated.
    Checks for duplicate email before updating.
    """
    
    if update_data.email and update_data.email != current_user.email:
        existing = get_user_by_email(db, update_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already in use by another account."
            )

    updated = update_user(db, user=current_user, update_data=update_data)
    return updated


@router.put("/me/password")
def change_my_password(
    password_data: PasswordChange,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change the password of the currently logged in user.
    Verifies current password before allowing change.
    New password must be at least 8 characters.
    """
    
    if not verify_password(
        password_data.current_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )

    
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters."
        )

    
    if password_data.current_password == password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password."
        )

    update_password(db, user=current_user, new_password=password_data.new_password)

    return {"message": "Password changed successfully."}