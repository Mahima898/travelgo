from pydantic import BaseModel
from typing import Optional, List, Any


class ItineraryDayResponse(BaseModel):
    id: int
    day_number: int
    title: Optional[str] = None
    destination_name: Optional[str] = None
    activities: List[Any] = []

    class Config:
        from_attributes = True


class ItineraryResponse(BaseModel):
    """
    Matches frontend MOCK_ITINERARY structure exactly
    Frontend uses: id, route_id, name, total_days, days
    """
    id: int
    route_id: int
    name: Optional[str] = None
    total_days: Optional[int] = None
    days: List[ItineraryDayResponse] = []

    class Config:
        from_attributes = True