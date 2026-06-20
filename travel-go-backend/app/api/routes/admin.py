from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.core.dependencies import get_current_admin

# Schemas
from app.schemas.route import RouteCreate, RouteUpdate, RouteResponse
from app.schemas.destination import (
    DestinationCreate, DestinationUpdate, DestinationResponse
)
from app.schemas.attraction import (
    AttractionCreate, FoodCreate, TipCreate,
    AttractionResponse, FoodResponse, TipResponse
)
from app.schemas.itinerary import ItineraryResponse
from app.schemas.user import UserResponse

# CRUD functions
from app.crud.route import (
    get_all_routes, get_route_by_id,
    create_route, update_route, delete_route,
    get_stop_count,
)
from app.crud.destination import (
    get_all_destinations, get_destination_by_id,
    create_destination, update_destination, delete_destination,
)
from app.crud.attraction import (
    get_attractions_by_stop,
    create_attraction, update_attraction, delete_attraction,
    get_food_by_stop, create_food, update_food, delete_food,
    get_tips_by_stop, create_tip, update_tip, delete_tip,
)
from app.crud.itinerary import (
    get_all_itineraries, get_itinerary_by_id,
    create_itinerary, update_itinerary, delete_itinerary,
)
from app.crud.user import get_all_users
from app.crud.trip import get_all_trips_admin

# Models
from app.models.attraction import Attraction, FoodItem, Tip
from app.models.user import User

router = APIRouter()

# HELPER — build route response with stop_count

def build_route_response(route, db: Session) -> dict:
    return {
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


@router.get("/stats")
def get_stats(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics.
    Returns count of all entities in the system.
    Only accessible by admin users.
    """
    from app.models.route import Route
    from app.models.destination import Destination
    from app.models.attraction import Attraction, FoodItem, Tip, Stop
    from app.models.itinerary import Itinerary
    from app.models.trip import Trip
    from app.models.user import User

    return {
        "routes":       db.query(Route).count(),
        "destinations": db.query(Destination).count(),
        "attractions":  db.query(Attraction).count(),
        "food":         db.query(FoodItem).count(),
        "tips":         db.query(Tip).count(),
        "itineraries":  db.query(Itinerary).count(),
        "users":        db.query(User).count(),
        "trips":        db.query(Trip).count(),
    }



@router.get("/routes", response_model=List[RouteResponse])
def admin_get_routes(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all routes regardless of status.
    Admin can see both published and draft routes.

    Query params:
    - skip: pagination offset
    - limit: number of routes to return
    """
    routes = get_all_routes(db, skip=skip, limit=limit)
    return [build_route_response(r, db) for r in routes]


@router.post(
    "/routes",
    response_model=RouteResponse,
    status_code=status.HTTP_201_CREATED
)
def admin_create_route(
    route_data: RouteCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new route.
    Validates required fields before creating.
    """
    if not route_data.name or not route_data.source or not route_data.destination:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="name, source and destination are required."
        )
    route = create_route(db, route_data)
    return build_route_response(route, db)


@router.put("/routes/{route_id}", response_model=RouteResponse)
def admin_update_route(
    route_id: int,
    update_data: RouteUpdate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update an existing route by ID.
    Only updates provided fields.

    Path param:
    - route_id: integer ID of the route
    """
    route = get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Route with id {route_id} not found."
        )
    updated = update_route(db, route=route, update_data=update_data)
    return build_route_response(updated, db)


@router.delete("/routes/{route_id}")
def admin_delete_route(
    route_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a route by ID.
    Also deletes all stops, attractions, food and tips for this route.

    Path param:
    - route_id: integer ID of the route
    """
    route = get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Route with id {route_id} not found."
        )
    delete_route(db, route_id)
    return {"message": f"Route '{route.name}' deleted successfully.", "id": route_id}



@router.get("/destinations", response_model=List[DestinationResponse])
def admin_get_destinations(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all destinations."""
    return get_all_destinations(db)


@router.post(
    "/destinations",
    response_model=DestinationResponse,
    status_code=status.HTTP_201_CREATED
)
def admin_create_destination(
    dest_data: DestinationCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new destination."""
    if not dest_data.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destination name is required."
        )
    return create_destination(db, dest_data)


@router.put("/destinations/{destination_id}", response_model=DestinationResponse)
def admin_update_destination(
    destination_id: int,
    update_data: DestinationUpdate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update a destination by ID.

    Path param:
    - destination_id: integer ID of the destination
    """
    dest = get_destination_by_id(db, destination_id)
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with id {destination_id} not found."
        )
    return update_destination(db, destination=dest, update_data=update_data)


@router.delete("/destinations/{destination_id}")
def admin_delete_destination(
    destination_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a destination by ID.

    Path param:
    - destination_id: integer ID of the destination
    """
    dest = get_destination_by_id(db, destination_id)
    if not dest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination with id {destination_id} not found."
        )
    delete_destination(db, destination_id)
    return {"message": f"Destination '{dest.name}' deleted.", "id": destination_id}



@router.get("/attractions")
def admin_get_attractions(
    stop_id: Optional[int] = Query(default=None),
    type: Optional[str] = Query(default=None),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all attractions.
    Optionally filter by stop_id or type.

    Query params:
    - stop_id: filter by stop
    - type: filter by 'attraction' or 'hidden_gem'
    """
    query = db.query(Attraction)
    if stop_id:
        query = query.filter(Attraction.stop_id == stop_id)
    if type:
        query = query.filter(Attraction.type == type)
    items = query.all()
    return [
        {
            "id": a.id,
            "stop_id": a.stop_id,
            "name": a.name,
            "type": a.type,
            "description": a.description,
            "why_special": a.why_special,
            "tags": a.tags or [],
        }
        for a in items
    ]


@router.post("/attractions", status_code=status.HTTP_201_CREATED)
def admin_create_attraction(
    stop_id: int,
    data: AttractionCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create an attraction or hidden gem for a stop.

    Query param:
    - stop_id: which stop this attraction belongs to
    """
    if not data.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attraction name is required."
        )
    item = create_attraction(db, stop_id=stop_id, data=data)
    return {
        "id": item.id,
        "stop_id": item.stop_id,
        "name": item.name,
        "type": item.type,
        "description": item.description,
        "why_special": item.why_special,
        "tags": item.tags or [],
    }


@router.put("/attractions/{attraction_id}")
def admin_update_attraction(
    attraction_id: int,
    data: AttractionCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update an attraction by ID.

    Path param:
    - attraction_id: integer ID of the attraction
    """
    item = db.query(Attraction).filter(
        Attraction.id == attraction_id
    ).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attraction with id {attraction_id} not found."
        )
    updated = update_attraction(
        db,
        attraction_id,
        data.model_dump(exclude_unset=True)
    )
    return updated


@router.delete("/attractions/{attraction_id}")
def admin_delete_attraction(
    attraction_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete an attraction by ID.

    Path param:
    - attraction_id: integer ID of the attraction
    """
    item = db.query(Attraction).filter(
        Attraction.id == attraction_id
    ).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attraction with id {attraction_id} not found."
        )
    delete_attraction(db, attraction_id)
    return {"message": f"Attraction '{item.name}' deleted.", "id": attraction_id}



@router.get("/food")
def admin_get_food(
    stop_id: Optional[int] = Query(default=None),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all food items.
    Optionally filter by stop_id.

    Query param:
    - stop_id: filter by stop
    """
    query = db.query(FoodItem)
    if stop_id:
        query = query.filter(FoodItem.stop_id == stop_id)
    items = query.all()
    return [
        {
            "id": f.id,
            "stop_id": f.stop_id,
            "name": f.name,
            "dish": f.dish,
            "where": f.where,
            "price_range": f.price_range,
            "description": f.description,
        }
        for f in items
    ]


@router.post("/food", status_code=status.HTTP_201_CREATED)
def admin_create_food(
    stop_id: int,
    data: FoodCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a food recommendation for a stop.

    Query param:
    - stop_id: which stop this food belongs to
    """
    if not data.dish:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dish name is required."
        )
    item = create_food(db, stop_id=stop_id, data=data)
    return {
        "id": item.id,
        "stop_id": item.stop_id,
        "name": item.name,
        "dish": item.dish,
        "where": item.where,
        "price_range": item.price_range,
        "description": item.description,
    }


@router.put("/food/{food_id}")
def admin_update_food(
    food_id: int,
    data: FoodCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update a food item by ID.

    Path param:
    - food_id: integer ID of the food item
    """
    item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with id {food_id} not found."
        )
    updated = update_food(db, food_id, data.model_dump(exclude_unset=True))
    return updated


@router.delete("/food/{food_id}")
def admin_delete_food(
    food_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a food item by ID.

    Path param:
    - food_id: integer ID of the food item
    """
    item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with id {food_id} not found."
        )
    delete_food(db, food_id)
    return {"message": f"Food item '{item.dish}' deleted.", "id": food_id}



@router.get("/tips")
def admin_get_tips(
    stop_id: Optional[int] = Query(default=None),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all travel tips.
    Optionally filter by stop_id.

    Query param:
    - stop_id: filter by stop
    """
    query = db.query(Tip)
    if stop_id:
        query = query.filter(Tip.stop_id == stop_id)
    items = query.all()
    return [
        {
            "id": t.id,
            "stop_id": t.stop_id,
            "text": t.text,
            "category": t.category,
        }
        for t in items
    ]


@router.post("/tips", status_code=status.HTTP_201_CREATED)
def admin_create_tip(
    stop_id: int,
    data: TipCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a travel tip for a stop.

    Query param:
    - stop_id: which stop this tip belongs to
    """
    if not data.text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tip text is required."
        )
    item = create_tip(db, stop_id=stop_id, data=data)
    return {
        "id": item.id,
        "stop_id": item.stop_id,
        "text": item.text,
        "category": item.category,
    }


@router.put("/tips/{tip_id}")
def admin_update_tip(
    tip_id: int,
    data: TipCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update a tip by ID.

    Path param:
    - tip_id: integer ID of the tip
    """
    item = db.query(Tip).filter(Tip.id == tip_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tip with id {tip_id} not found."
        )
    updated = update_tip(db, tip_id, data.model_dump(exclude_unset=True))
    return updated


@router.delete("/tips/{tip_id}")
def admin_delete_tip(
    tip_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a tip by ID.

    Path param:
    - tip_id: integer ID of the tip
    """
    item = db.query(Tip).filter(Tip.id == tip_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tip with id {tip_id} not found."
        )
    delete_tip(db, tip_id)
    return {"message": "Tip deleted.", "id": tip_id}



@router.get("/itineraries")
def admin_get_itineraries(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all itineraries."""
    itins = get_all_itineraries(db)
    return [
        {
            "id": i.id,
            "route_id": i.route_id,
            "name": i.name,
            "total_days": i.total_days,
            "days_count": len(i.days) if i.days else 0,
            "route_name": i.route.name if i.route else None,
        }
        for i in itins
    ]


@router.post("/itineraries", status_code=status.HTTP_201_CREATED)
def admin_create_itinerary(
    route_id: int,
    name: str,
    total_days: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new itinerary for a route.

    Query params:
    - route_id: which route this itinerary belongs to
    - name: itinerary name
    - total_days: total number of days
    """
    from app.crud.route import get_route_by_id
    route = get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Route with id {route_id} not found."
        )
    itin = create_itinerary(db, route_id=route_id, name=name, total_days=total_days)
    return {
        "id": itin.id,
        "route_id": itin.route_id,
        "name": itin.name,
        "total_days": itin.total_days,
        "days_count": 0,
    }


@router.put("/itineraries/{itinerary_id}")
def admin_update_itinerary(
    itinerary_id: int,
    name: Optional[str] = None,
    total_days: Optional[int] = None,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Update an itinerary by ID.

    Path param:
    - itinerary_id: integer ID of the itinerary
    """
    itin = get_itinerary_by_id(db, itinerary_id)
    if not itin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary with id {itinerary_id} not found."
        )
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if total_days is not None:
        update_data["total_days"] = total_days
    updated = update_itinerary(db, itinerary_id, update_data)
    return updated


@router.delete("/itineraries/{itinerary_id}")
def admin_delete_itinerary(
    itinerary_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Delete an itinerary and all its days.

    Path param:
    - itinerary_id: integer ID of the itinerary
    """
    itin = get_itinerary_by_id(db, itinerary_id)
    if not itin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Itinerary with id {itinerary_id} not found."
        )
    delete_itinerary(db, itinerary_id)
    return {"message": f"Itinerary '{itin.name}' deleted.", "id": itinerary_id}



@router.get("/users", response_model=List[UserResponse])
def admin_get_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all registered users.
    Only accessible by admin.

    Query params:
    - skip: pagination offset
    - limit: number of users to return
    """
    return get_all_users(db, skip=skip, limit=limit)