from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password, verify_password


def get_user_by_id(db: Session, user_id: int):
    """
    GET user by primary key id
    Returns User object or None
    """
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    """
    GET user by email address
    Used during login to find the user
    Returns User object or None
    """
    return db.query(User).filter(User.email == email).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    """
    GET all users with pagination
    skip = how many to skip (offset)
    limit = how many to return
    Used by admin panel
    """
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_data: UserCreate):
    """
    CREATE a new user in database
    Hashes the password before storing
    Never store plain text passwords
    """
    hashed = hash_password(user_data.password)

    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed,
        role="user",       
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)   
    return db_user


def update_user(db: Session, user: User, update_data: UserUpdate):
    """
    UPDATE user profile (name or email)
    Only updates fields that are provided (not None)
    """
    if update_data.name is not None:
        user.name = update_data.name
    if update_data.email is not None:
        user.email = update_data.email

    db.commit()
    db.refresh(user)
    return user


def update_password(db: Session, user: User, new_password: str):
    """
    UPDATE user password
    Hashes new password before storing
    """
    user.password = hash_password(new_password)
    db.commit()
    return user


def authenticate_user(db: Session, email: str, password: str):
    """
    Verify email + password combination
    Used in login route
    Returns User if credentials are correct
    Returns None if email not found or password wrong
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def delete_user(db: Session, user_id: int):
    """
    DELETE user by id
    Used by admin panel
    """
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user