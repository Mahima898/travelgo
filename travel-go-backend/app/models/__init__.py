# ============================================================
# TRAVELGO — MODELS INIT
# Import all models here so SQLAlchemy knows about them
# This is needed for Base.metadata.create_all() to work
# ============================================================

from app.models.user import User
from app.models.destination import Destination
from app.models.route import Route
from app.models.attraction import Stop, Attraction, FoodItem, Tip
from app.models.itinerary import Itinerary, ItineraryDay
from app.models.trip import Trip