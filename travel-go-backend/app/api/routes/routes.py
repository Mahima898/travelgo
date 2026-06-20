from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.route import RouteResponse
from app.crud.route import (
    get_all_routes,
    get_route_by_id,
    get_popular_routes,
    search_routes,
    get_destination_names,
    get_stop_count,
)

router = APIRouter()


def build_route_response(route, db: Session) -> dict:
    """
    Convert SQLAlchemy Route object to dict with stop_count
    stop_count = number of stops linked to this route
    """
    route_dict = {
        "id": route.id,
        "name": route.name,
        "source": route.source,
        "destination": route.destination,
        "transport_type": route.transport_type,
        "duration_min": route.duration_min,
        "duration_max": route.duration_max,
        "distance_km": route.distance_km,
        "budget_min": route.budget_min,
        "budget_max": route.budget_max,
        "description": route.description,
        "cover_image": route.cover_image,
        "tags": route.tags or [],
        "dont_miss": route.dont_miss or [],
        "highlights": route.highlights or {},
        "status": route.status,
        "stop_count": get_stop_count(db, route.id),
    }
    return route_dict


@router.get("/popular", response_model=List[RouteResponse])
def get_popular(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """
    Get popular published routes.
    Used on Home page to show featured routes.

    Query param:
    - limit: how many routes to return (default 6)
    """
    routes = get_popular_routes(db, limit=limit)
    return [build_route_response(r, db) for r in routes]


@router.get("/search", response_model=List[RouteResponse])
def search(
    from_city: Optional[str] = Query(default=None, alias="from"),
    to_city: Optional[str] = Query(default=None, alias="to"),
    db: Session = Depends(get_db)
):
    """
    Search routes by source and destination.
    Both parameters are optional.
    Uses case-insensitive partial matching.

    Query params:
    - from: source city name
    - to: destination city name
    """
    if not from_city and not to_city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least one of: from, to"
        )

    routes = search_routes(db, from_city, to_city)
    return [build_route_response(r, db) for r in routes]


@router.get("/destination-names", response_model=List[str])
def get_names(db: Session = Depends(get_db)):
    """
    Get all unique source and destination city names.
    Used for search bar autocomplete suggestions.
    Returns a sorted list of city names.
    """
    return get_destination_names(db)


@router.get("", response_model=List[RouteResponse])
def get_routes(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get all published routes.
    Supports pagination with skip and limit.
    """
    routes = get_all_routes(db, skip=skip, limit=limit, status="published")
    return [build_route_response(r, db) for r in routes]


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(
    route_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single route by its ID.
    Used by RouteExplorer page to load full route details.

    Path param:
    - route_id: integer ID of the route
    """
    route = get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Route with id {route_id} not found."
        )
    return build_route_response(route, db)