from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud.itinerary import get_itinerary_by_route
from app.crud.route import get_route_by_id

router = APIRouter()


def build_itinerary_response(itinerary) -> dict:
    """
    Build itinerary response matching frontend MOCK_ITINERARY
    Frontend TripPlanner expects:
    {
        id, route_id, name, total_days,
        days: [{ id, day_number, title, destination_name, activities }]
    }
    """
    return {
        "id": itinerary.id,
        "route_id": itinerary.route_id,
        "name": itinerary.name,
        "total_days": itinerary.total_days,
        "days": [
            {
                "id": day.id,
                "day_number": day.day_number,
                "title": day.title,
                "destination_name": day.destination_name,
                
                
                "activities": day.activities or [],
            }
            for day in (itinerary.days or [])
        ],
    }


@router.get("/route/{route_id}")
def get_itinerary_for_route(
    route_id: int,
    db: Session = Depends(get_db)
):
    """
    Get itinerary for a specific route.
    Used by TripPlanner to load the base itinerary
    that the user will customize.

    Path param:
    - route_id: integer ID of the route
    """
    
    route = get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Route with id {route_id} not found."
        )

    
    itinerary = get_itinerary_by_route(db, route_id)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No itinerary found for route {route_id}. Admin needs to add one."
        )

    return build_itinerary_response(itinerary)