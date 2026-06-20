from app.database import SessionLocal
from app.crud.user import create_user, get_user_by_email
from app.schemas.user import UserCreate
from app.models.user import User


from app.models import User, Destination, Route, Stop
from app.models import Attraction, FoodItem, Tip, Itinerary, ItineraryDay, Trip
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = get_user_by_email(db, "admin@travelgo.com")
if existing:
    print("Admin user already exists!")
    print(f"Email: admin@travelgo.com")
else:
    admin_data = UserCreate(
        name="TravelGo Admin",
        email="admin@travelgo.com",
        password="admin123456"
    )
    admin = create_user(db, admin_data)

    
    admin.role = "admin"
    db.commit()

    print("Admin user created successfully!")
    print(f"Email: admin@travelgo.com")
    print(f"Password: admin123456")
    print(f"Role: {admin.role}")

db.close()