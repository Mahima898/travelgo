from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.database import Base


class Stop(Base):
    __tablename__ = "stops"

    id                 = Column(Integer, primary_key=True, index=True)
    route_id           = Column(Integer, ForeignKey("routes.id", ondelete="CASCADE"))
    destination_id     = Column(Integer, ForeignKey("destinations.id"))
    order              = Column(Integer, nullable=False)
    day_recommendation = Column(String(50))
    distance_from_prev = Column(Integer, default=0)

    route       = relationship("Route", back_populates="stops")
    destination = relationship("Destination", back_populates="stops")
    attractions = relationship("Attraction", back_populates="stop",
                               cascade="all, delete")
    food_items  = relationship("FoodItem", back_populates="stop",
                               cascade="all, delete")
    tips        = relationship("Tip", back_populates="stop",
                               cascade="all, delete")


class Attraction(Base):
    __tablename__ = "attractions"

    id          = Column(Integer, primary_key=True, index=True)
    stop_id     = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"))
    name        = Column(String(200), nullable=False)
    type        = Column(String(50), default="attraction")
    description = Column(Text)
    why_special = Column(Text)
    tags        = Column(JSON, default=[])
    image       = Column(String(500), nullable=True)   # ← NEW
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    stop = relationship("Stop", back_populates="attractions")


class FoodItem(Base):
    __tablename__ = "food_items"

    id          = Column(Integer, primary_key=True, index=True)
    stop_id     = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"))
    name        = Column(String(200))
    dish        = Column(String(200), nullable=False)
    where       = Column(String(300))
    price_range = Column(String(50))
    description = Column(Text)
    image       = Column(String(500), nullable=True)   # ← NEW
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    stop = relationship("Stop", back_populates="food_items")


class Tip(Base):
    __tablename__ = "tips"

    id         = Column(Integer, primary_key=True, index=True)
    stop_id    = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"))
    text       = Column(Text, nullable=False)
    category   = Column(String(50), default="general")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stop = relationship("Stop", back_populates="tips")