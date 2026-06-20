from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.database import Base


class Destination(Base):
    __tablename__ = "destinations"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(150), unique=True, nullable=False, index=True)
    region      = Column(String(200))
    description = Column(Text)
    best_season = Column(String(100))
    cover_image = Column(String(500))
    tags        = Column(JSON, default=[])   # ["Nature", "Adventure"]
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # One destination has many stops
    stops = relationship("Stop", back_populates="destination")