from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.crud.route import get_route_by_id
from app.crud.attraction import get_stops_by_route

router = APIRouter()


def build_stop_response(stop) -> dict:
    all_items = stop.attractions or []
    attractions = [a for a in all_items if a.type == "attraction"]
    hidden_gems = [a for a in all_items if a.type == "hidden_gem"]

    destination = None
    if stop.destination:
        destination = {
            "id":     stop.destination.id,
            "name":   stop.destination.name,
            "region": stop.destination.region,
        }

    return {
        "id":                 stop.id,
        "route_id":           stop.route_id,
        "order":              stop.order,
        "day_recommendation": stop.day_recommendation,
        "distance_from_prev": stop.distance_from_prev or 0,
        "destination":        destination,
        "attractions": [
            {
                "id":          a.id,
                "name":        a.name,
                "type":        a.type,
                "description": a.description,
                "why_special": a.why_special,
                "tags":        a.tags or [],
                "image":       a.image,       # ← NEW
            }
            for a in attractions
        ],
        "hidden_gems": [
            {
                "id":          a.id,
                "name":        a.name,
                "type":        a.type,
                "description": a.description,
                "why_special": a.why_special,
                "tags":        a.tags or [],
                "image":       a.image,       # ← NEW
            }
            for a in hidden_gems
        ],
        "food": [
            {
                "id":          f.id,
                "name":        f.name,
                "dish":        f.dish,
                "where":       f.where,
                "price_range": f.price_range,
                "description": f.description,
                "image":       f.image,       # ← NEW
            }
            for f in (stop.food_items or [])
        ],
        "tips": [
            {
                "id":       t.id,
                "text":     t.text,
                "category": t.category,
            }
            for t in (stop.tips or [])
        ],
    }


@router.get("/{route_id}/stops")
def get_route_stops(route_id: int, db: Session = Depends(get_db)):
    route = get_route_by_id(db, route_id)
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Route with id {route_id} not found."
        )
    stops = get_stops_by_route(db, route_id)
    if not stops:
        return []
    return [build_stop_response(stop) for stop in stops]