from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    route_id         = Column(Integer, ForeignKey("routes.id", ondelete="SET NULL"),
                              nullable=True)
    name             = Column(String(200), nullable=False)
    route_source      = Column(String(150))
    route_destination = Column(String(150))
    start_date       = Column(Date, nullable=True)
    days_count       = Column(Integer, default=0)
    total_activities = Column(Integer, default=0)
    status           = Column(String(50), default="planned")
    # Store customized days as JSON
    customized_days  = Column(JSON, default=[])
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())

    user  = relationship("User", back_populates="trips")
    route = relationship("Route", back_populates="trips")