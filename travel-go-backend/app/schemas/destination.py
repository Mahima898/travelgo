from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DestinationCreate(BaseModel):
    name: str
    region: Optional[str] = None
    description: Optional[str] = None
    best_season: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = []


class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    description: Optional[str] = None
    best_season: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None


class DestinationResponse(BaseModel):
    """
    Matches frontend MOCK_DESTINATIONS structure exactly
    Frontend uses: id, name, region, description,
                   best_season, cover_image, tags
    """
    id: int
    name: str
    region: Optional[str] = None
    description: Optional[str] = None
    best_season: Optional[str] = None
    cover_image: Optional[str] = None
    tags: List[str] = []

    class Config:
        from_attributes = True