from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    """Data required to register a new user"""
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Data required to login"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Data for updating profile"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class PasswordChange(BaseModel):
    """Data for changing password"""
    current_password: str
    new_password: str


class UserResponse(BaseModel):
    """
    What we send back to frontend after login or profile fetch
    Must match the user object frontend stores in localStorage
    """
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True   


class Token(BaseModel):
    """
    JWT token response after successful login
    Frontend stores access_token in localStorage as 'tg_token'
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse