from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.route import Route
from app.models.attraction import Stop
from app.schemas.route import RouteCreate, RouteUpdate


def get_all_routes(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    tags: list = None
):
    """
    GET all routes with optional filters
    status → filter by 'published' or 'draft'
    tags   → filter by tag names
    """
    query = db.query(Route)

    
    if status:
        query = query.filter(Route.status == status)

    return query.offset(skip).limit(limit).all()


def get_route_by_id(db: Session, route_id: int):
    """
    GET single route by id
    Path parameter → /routes/{route_id}
    Returns Route object or None
    """
    return db.query(Route).filter(Route.id == route_id).first()


def get_popular_routes(db: Session, limit: int = 6):
    """
    GET popular published routes
    Returns only published routes
    Used on Home page
    """
    return (
        db.query(Route)
        .filter(Route.status == "published")
        .limit(limit)
        .all()
    )


def search_routes(db: Session, from_city: str, to_city: str):
    """
    Search routes by source and destination
    Query parameters → /routes/search?from=Delhi&to=Kashmir
    Case-insensitive search using ilike
    """
    query = db.query(Route).filter(Route.status == "published")

    if from_city:
        # ilike = case-insensitive LIKE
        query = query.filter(
            Route.source.ilike(f"%{from_city}%")
        )
    if to_city:
        query = query.filter(
            Route.destination.ilike(f"%{to_city}%")
        )

    return query.all()


def get_destination_names(db: Session):
    """
    GET all unique source and destination names
    Used for search bar autocomplete suggestions
    Returns a flat list of unique city names
    """
    sources = db.query(Route.source).distinct().all()
    destinations = db.query(Route.destination).distinct().all()

    
    all_names = set()
    for (name,) in sources:
        all_names.add(name)
    for (name,) in destinations:
        all_names.add(name)

    return sorted(list(all_names))


def get_stop_count(db: Session, route_id: int) -> int:
    """
    COUNT stops for a route
    Used to calculate stop_count in RouteResponse
    """
    return db.query(Stop).filter(Stop.route_id == route_id).count()


def create_route(db: Session, route_data: RouteCreate):
    """
    CREATE a new route
    Used by admin panel
    """
    db_route = Route(
        name=route_data.name,
        source=route_data.source,
        destination=route_data.destination,
        transport_type=route_data.transport_type or "Road",
        duration_min=route_data.duration_min,
        duration_max=route_data.duration_max,
        distance_km=route_data.distance_km,
        budget_min=route_data.budget_min,
        budget_max=route_data.budget_max,
        description=route_data.description,
        cover_image=route_data.cover_image,
        tags=route_data.tags or [],
        dont_miss=route_data.dont_miss or [],
        highlights=route_data.highlights or {},
        status=route_data.status or "draft",
    )
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route


def update_route(db: Session, route: Route, update_data: RouteUpdate):
    """
    UPDATE an existing route
    Only updates fields that are provided (not None)
    Used by admin panel
    """
    update_fields = update_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(route, field, value)

    db.commit()
    db.refresh(route)
    return route


def delete_route(db: Session, route_id: int):
    """
    DELETE a route by id
    Cascade deletes all stops, attractions, tips etc
    Used by admin panel
    """
    route = get_route_by_id(db, route_id)
    if route:
        db.delete(route)
        db.commit()
    return route