from sqlalchemy.orm import Session

from app.models.itinerary import Itinerary, ItineraryDay


def get_itinerary_by_route(db: Session, route_id: int):
    """
    GET itinerary for a specific route
    Used by TripPlanner page to load base itinerary
    Query: /itineraries/route/{route_id}
    """
    return (
        db.query(Itinerary)
        .filter(Itinerary.route_id == route_id)
        .first()
    )


def get_itinerary_by_id(db: Session, itinerary_id: int):
    """GET itinerary by its own id"""
    return (
        db.query(Itinerary)
        .filter(Itinerary.id == itinerary_id)
        .first()
    )


def get_all_itineraries(db: Session, skip: int = 0, limit: int = 100):
    """GET all itineraries — used by admin panel"""
    return db.query(Itinerary).offset(skip).limit(limit).all()


def create_itinerary(
    db: Session,
    route_id: int,
    name: str,
    total_days: int
):
    """CREATE a new itinerary for a route"""
    itin = Itinerary(
        route_id=route_id,
        name=name,
        total_days=total_days,
    )
    db.add(itin)
    db.commit()
    db.refresh(itin)
    return itin


def create_itinerary_day(
    db: Session,
    itinerary_id: int,
    day_number: int,
    title: str,
    destination_name: str,
    activities: list
):
    """CREATE a single day inside an itinerary"""
    day = ItineraryDay(
        itinerary_id=itinerary_id,
        day_number=day_number,
        title=title,
        destination_name=destination_name,
        activities=activities,
    )
    db.add(day)
    db.commit()
    db.refresh(day)
    return day


def update_itinerary(db: Session, itinerary_id: int, data: dict):
    """UPDATE itinerary fields"""
    itin = get_itinerary_by_id(db, itinerary_id)
    if itin:
        for field, value in data.items():
            setattr(itin, field, value)
        db.commit()
        db.refresh(itin)
    return itin


def delete_itinerary(db: Session, itinerary_id: int):
    """DELETE itinerary and all its days"""
    itin = get_itinerary_by_id(db, itinerary_id)
    if itin:
        db.delete(itin)
        db.commit()
    return itin