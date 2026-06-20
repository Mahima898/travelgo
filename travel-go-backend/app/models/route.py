from sqlalchemy import Column, Integer, String, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime
import enum

from app.database import Base


class RouteStatus(str, enum.Enum):
    draft = "draft"
    published = "published"


class Route(Base):
    __tablename__ = "routes"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(200), nullable=False)
    source        = Column(String(150), nullable=False)
    destination   = Column(String(150), nullable=False)
    transport_type = Column(String(50), default="Road")
    duration_min  = Column(Integer)             
    duration_max  = Column(Integer)               
    distance_km   = Column(Integer)
    budget_min    = Column(Integer)              
    budget_max    = Column(Integer)
    description   = Column(Text)
    cover_image   = Column(String(500))
    tags          = Column(JSON, default=[])      
    dont_miss     = Column(JSON, default=[])      
    highlights    = Column(JSON, default={})      
    status        = Column(String(20), default="draft")
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    
    stops      = relationship("Stop", back_populates="route",
                              order_by="Stop.order")
    itinerary  = relationship("Itinerary", back_populates="route",
                              uselist=False)
    trips      = relationship("Trip", back_populates="route")