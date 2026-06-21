from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import engine, Base

# Import all models so SQLAlchemy registers them
from app.models.user import User
from app.models.destination import Destination
from app.models.route import Route
from app.models.attraction import Stop, Attraction, FoodItem, Tip
from app.models.itinerary import Itinerary, ItineraryDay
from app.models.trip import Trip


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="TravelGo Backend API — Travel Discovery Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "http://localhost:5184",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
         "https://travelgo-beta-azure.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "message": "TravelGo API is running successfully!",
        "docs": "Visit /docs for API documentation"
    }


from app.api.routes import auth
from app.api.routes import routes
from app.api.routes import attractions
from app.api.routes import destinations
from app.api.routes import itineraries
from app.api.routes import trips
from app.api.routes import users
from app.api.routes import admin

app.include_router(auth.router,         prefix="/auth",         tags=["Auth"])
app.include_router(routes.router,       prefix="/routes",       tags=["Routes"])
app.include_router(attractions.router,  prefix="/routes",       tags=["Stops"])
app.include_router(destinations.router, prefix="/destinations", tags=["Destinations"])
app.include_router(itineraries.router,  prefix="/itineraries",  tags=["Itineraries"])
app.include_router(trips.router,        prefix="/trips",        tags=["Trips"])
app.include_router(users.router,        prefix="/users",        tags=["Users"])
app.include_router(admin.router,        prefix="/admin",        tags=["Admin"])