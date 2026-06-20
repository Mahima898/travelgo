from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate


def get_all_trips_by_user(db: Session, user_id: int):
    """
    GET all trips belonging to a specific user
    Only returns trips owned by this user
    user_id comes from JWT token — not from URL
    """
    return (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
        .all()
    )


def get_trip_by_id(db: Session, trip_id: int):
    """
    GET single trip by id
    Used before update and delete to check it exists
    """
    return db.query(Trip).filter(Trip.id == trip_id).first()


def get_trip_by_id_and_user(db: Session, trip_id: int, user_id: int):
    """
    GET trip only if it belongs to this user
    Prevents user A from accessing user B's trip
    This is called ownership check
    """
    return (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        )
        .first()
    )


def create_trip(db: Session, trip_data: TripCreate, user_id: int):
    """
    CREATE a new saved trip for a user
    user_id from JWT token ensures trip is linked to correct user
    """
    db_trip = Trip(
        user_id=user_id,
        route_id=trip_data.route_id,
        name=trip_data.name,
        route_source=trip_data.route_source,
        route_destination=trip_data.route_destination,
        start_date=trip_data.start_date,
        days_count=trip_data.days_count or 0,
        total_activities=trip_data.total_activities or 0,
        customized_days=trip_data.customized_days or [],
        status="planned",
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


def update_trip(db: Session, trip: Trip, update_data: TripUpdate):
    """
    UPDATE a trip
    Only updates fields that are provided
    """
    update_fields = update_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(trip, field, value)
    db.commit()
    db.refresh(trip)
    return trip


def delete_trip(db: Session, trip: Trip):
    """
    DELETE a trip
    trip object is passed in (already ownership-checked)
    """
    db.delete(trip)
    db.commit()


def get_all_trips_admin(db: Session, skip: int = 0, limit: int = 100):
    """
    GET all trips from all users
    Used by admin panel only
    """
    return db.query(Trip).offset(skip).limit(limit).all()