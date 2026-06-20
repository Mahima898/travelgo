from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.database import Base


class Itinerary(Base):
    __tablename__ = "itineraries"

    id         = Column(Integer, primary_key=True, index=True)
    route_id   = Column(Integer, ForeignKey("routes.id", ondelete="CASCADE"),
                        unique=True)
    name       = Column(String(200))
    total_days = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    route = relationship("Route", back_populates="itinerary")
    days  = relationship("ItineraryDay", back_populates="itinerary",
                         order_by="ItineraryDay.day_number",
                         cascade="all, delete")


class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id               = Column(Integer, primary_key=True, index=True)
    itinerary_id     = Column(Integer, ForeignKey("itineraries.id",
                                                   ondelete="CASCADE"))
    day_number       = Column(Integer, nullable=False)  # 1, 2, 3...
    title            = Column(String(200))
    destination_name = Column(String(150))
    # Activities stored as JSON list for simplicity
    # [{id, name, time_slot, type, description}]
    activities       = Column(JSON, default=[])

    itinerary = relationship("Itinerary", back_populates="days")