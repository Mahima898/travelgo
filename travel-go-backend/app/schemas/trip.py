from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date, datetime


class TripCreate(BaseModel):
    """What frontend sends when saving a trip"""
    route_id: Optional[int] = None
    name: str
    route_source: Optional[str] = None
    route_destination: Optional[str] = None
    start_date: Optional[date] = None
    days_count: Optional[int] = 0
    total_activities: Optional[int] = 0
    customized_days: Optional[List[Any]] = []


class TripUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    status: Optional[str] = None
    customized_days: Optional[List[Any]] = None


class TripResponse(BaseModel):
    """
    Matches frontend SavedTrips structure exactly
    Frontend uses: id, name, route_source, route_destination,
                   start_date, days_count, total_activities,
                   status, created_at
    """
    id: int
    name: str
    route_id: Optional[int] = None
    route_source: Optional[str] = None
    route_destination: Optional[str] = None
    start_date: Optional[date] = None
    days_count: int = 0
    total_activities: int = 0
    status: str
    created_at: datetime

    class Config:
        from_attributes = True