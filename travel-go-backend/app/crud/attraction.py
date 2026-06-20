from sqlalchemy.orm import Session

from app.models.attraction import Stop, Attraction, FoodItem, Tip
from app.schemas.attraction import AttractionCreate, FoodCreate, TipCreate



def get_stops_by_route(db: Session, route_id: int):
    """
    GET all stops for a route ordered by stop number
    Used by RouteExplorer page to show stop list
    Path param route_id comes from /routes/{route_id}/stops
    """
    return (
        db.query(Stop)
        .filter(Stop.route_id == route_id)
        .order_by(Stop.order)
        .all()
    )


def get_stop_by_id(db: Session, stop_id: int):
    """GET single stop by id"""
    return db.query(Stop).filter(Stop.id == stop_id).first()


def create_stop(
    db: Session,
    route_id: int,
    destination_id: int,
    order: int,
    day_recommendation: str = None,
    distance_from_prev: int = 0,
):
    """CREATE a new stop for a route"""
    stop = Stop(
        route_id=route_id,
        destination_id=destination_id,
        order=order,
        day_recommendation=day_recommendation,
        distance_from_prev=distance_from_prev,
    )
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return stop


def delete_stop(db: Session, stop_id: int):
    """DELETE stop and all its attractions, food, tips"""
    stop = get_stop_by_id(db, stop_id)
    if stop:
        db.delete(stop)
        db.commit()
    return stop



def get_attractions_by_stop(db: Session, stop_id: int):
    """GET all items for a stop — split by type in route handler"""
    return (
        db.query(Attraction)
        .filter(Attraction.stop_id == stop_id)
        .all()
    )


def create_attraction(
    db: Session,
    stop_id: int,
    data: AttractionCreate
):
    """CREATE attraction or hidden gem for a stop"""
    item = Attraction(
        stop_id=stop_id,
        name=data.name,
        type=data.type or "attraction",
        description=data.description,
        why_special=data.why_special,
        tags=data.tags or [],
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_attraction(db: Session, attraction_id: int, data: dict):
    """UPDATE an attraction"""
    item = db.query(Attraction).filter(
        Attraction.id == attraction_id
    ).first()
    if item:
        for field, value in data.items():
            setattr(item, field, value)
        db.commit()
        db.refresh(item)
    return item


def delete_attraction(db: Session, attraction_id: int):
    """DELETE an attraction"""
    item = db.query(Attraction).filter(
        Attraction.id == attraction_id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return item



def get_food_by_stop(db: Session, stop_id: int):
    """GET all food items for a stop"""
    return (
        db.query(FoodItem)
        .filter(FoodItem.stop_id == stop_id)
        .all()
    )


def create_food(db: Session, stop_id: int, data: FoodCreate):
    """CREATE a food recommendation for a stop"""
    item = FoodItem(
        stop_id=stop_id,
        name=data.name,
        dish=data.dish,
        where=data.where,
        price_range=data.price_range or "Budget",
        description=data.description,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_food(db: Session, food_id: int, data: dict):
    """UPDATE a food item"""
    item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if item:
        for field, value in data.items():
            setattr(item, field, value)
        db.commit()
        db.refresh(item)
    return item


def delete_food(db: Session, food_id: int):
    """DELETE a food item"""
    item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item



def get_tips_by_stop(db: Session, stop_id: int):
    """GET all tips for a stop"""
    return (
        db.query(Tip)
        .filter(Tip.stop_id == stop_id)
        .all()
    )


def create_tip(db: Session, stop_id: int, data: TipCreate):
    """CREATE a travel tip for a stop"""
    item = Tip(
        stop_id=stop_id,
        text=data.text,
        category=data.category or "general",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_tip(db: Session, tip_id: int, data: dict):
    """UPDATE a tip"""
    item = db.query(Tip).filter(Tip.id == tip_id).first()
    if item:
        for field, value in data.items():
            setattr(item, field, value)
        db.commit()
        db.refresh(item)
    return item


def delete_tip(db: Session, tip_id: int):
    """DELETE a tip"""
    item = db.query(Tip).filter(Tip.id == tip_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item