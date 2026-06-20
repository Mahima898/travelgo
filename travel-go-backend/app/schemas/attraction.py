from pydantic import BaseModel
from typing import Optional, List


class AttractionCreate(BaseModel):
    name:        str
    type:        Optional[str]  = "attraction"
    description: Optional[str] = None
    why_special: Optional[str] = None
    tags:        Optional[List[str]] = []
    image:       Optional[str] = None    


class AttractionResponse(BaseModel):
    id:          int
    name:        str
    type:        str
    description: Optional[str] = None
    why_special: Optional[str] = None
    tags:        List[str] = []
    image:       Optional[str] = None    

    class Config:
        from_attributes = True


class FoodCreate(BaseModel):
    name:        Optional[str] = None
    dish:        str
    where:       Optional[str] = None
    price_range: Optional[str] = "Budget"
    description: Optional[str] = None
    image:       Optional[str] = None   


class FoodResponse(BaseModel):
    id:          int
    name:        Optional[str] = None
    dish:        str
    where:       Optional[str] = None
    price_range: Optional[str] = None
    description: Optional[str] = None
    image:       Optional[str] = None    

    class Config:
        from_attributes = True


class TipCreate(BaseModel):
    text:     str
    category: Optional[str] = "general"


class TipResponse(BaseModel):
    id:       int
    text:     str
    category: str

    class Config:
        from_attributes = True


class DestinationMini(BaseModel):
    id:     int
    name:   str
    region: Optional[str] = None

    class Config:
        from_attributes = True


class StopResponse(BaseModel):
    id:                 int
    route_id:           int
    order:              int
    day_recommendation: Optional[str] = None
    distance_from_prev: int = 0
    destination:        Optional[DestinationMini] = None
    attractions:        List[AttractionResponse] = []
    hidden_gems:        List[AttractionResponse] = []
    food:               List[FoodResponse] = []
    tips:               List[TipResponse] = []

    class Config:
        from_attributes = True