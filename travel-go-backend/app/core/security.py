from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")




def hash_password(password: str) -> str:
    """
    Convert plain password to bcrypt hash
    Example: "mypassword123" → "$2b$12$xyz..."
    Store the hash in database, never the plain password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if plain password matches the stored hash
    Used during login to verify user's password
    Returns True if match, False if wrong password
    """
    return pwd_context.verify(plain_password, hashed_password)



def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token with user data inside
    data should contain: {"sub": user_id, "role": user_role}

    Token structure (decoded):
    {
        "sub": "1",           # user id as string
        "role": "user",       # user role
        "exp": 1234567890     # expiry timestamp
    }
    """
    to_encode = data.copy()

    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token
    Returns the payload dict if valid
    Returns None if token is invalid or expired

    Frontend sends: Authorization: Bearer <token>
    We extract <token> and decode it here
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None