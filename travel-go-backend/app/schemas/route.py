from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class RouteCreate(BaseModel):
    name: str
    source: str
    destination: str
    transport_type: Optional[str] = "Road"
    duration_min: Optional[int] = None
    duration_max: Optional[int] = None
    distance_km: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = []
    dont_miss: Optional[List[str]] = []
    highlights: Optional[Dict[str, Any]] = {}
    status: Optional[str] = "draft"


class RouteUpdate(BaseModel):
    name: Optional[str] = None
    source: Optional[str] = None
    destination: Optional[str] = None
    transport_type: Optional[str] = None
    duration_min: Optional[int] = None
    duration_max: Optional[int] = None
    distance_km: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None
    dont_miss: Optional[List[str]] = None
    highlights: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class RouteResponse(BaseModel):
    """
    Matches frontend MOCK_ROUTES structure exactly
    Frontend uses all these fields in RouteCard and RouteExplorer
    stop_count is calculated from number of stops
    """
    id: int
    name: str
    source: str
    destination: str
    transport_type: str
    duration_min: Optional[int] = None
    duration_max: Optional[int] = None
    distance_km: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    tags: List[str] = []
    dont_miss: List[str] = []
    highlights: Dict[str, Any] = {}
    status: str
    stop_count: int = 0

    class Config:
        from_attributes = True