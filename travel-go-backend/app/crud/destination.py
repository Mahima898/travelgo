from sqlalchemy.orm import Session

from app.models.destination import Destination
from app.schemas.destination import DestinationCreate, DestinationUpdate


def get_all_destinations(db: Session, skip: int = 0, limit: int = 100):
    """GET all destinations"""
    return db.query(Destination).offset(skip).limit(limit).all()


def get_destination_by_id(db: Session, destination_id: int):
    """
    GET single destination by id
    Path parameter → /destinations/{destination_id}
    """
    return (
        db.query(Destination)
        .filter(Destination.id == destination_id)
        .first()
    )


def get_destination_by_name(db: Session, name: str):
    """GET destination by exact name"""
    return (
        db.query(Destination)
        .filter(Destination.name == name)
        .first()
    )


def create_destination(db: Session, dest_data: DestinationCreate):
    """CREATE a new destination"""
    db_dest = Destination(
        name=dest_data.name,
        region=dest_data.region,
        description=dest_data.description,
        best_season=dest_data.best_season,
        cover_image=dest_data.cover_image,
        tags=dest_data.tags or [],
    )
    db.add(db_dest)
    db.commit()
    db.refresh(db_dest)
    return db_dest


def update_destination(
    db: Session,
    destination: Destination,
    update_data: DestinationUpdate
):
    """UPDATE destination — only provided fields"""
    update_fields = update_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(destination, field, value)
    db.commit()
    db.refresh(destination)
    return destination


def delete_destination(db: Session, destination_id: int):
    """DELETE destination by id"""
    dest = get_destination_by_id(db, destination_id)
    if dest:
        db.delete(dest)
        db.commit()
    return dest