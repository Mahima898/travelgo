from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.destination import Destination
from app.models.route import Route
from app.models.attraction import Stop, Attraction, FoodItem, Tip
from app.models.itinerary import Itinerary, ItineraryDay
from app.models.trip import Trip

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("Seeding destinations...")

destinations_data = [
    {
        "name": "Delhi",
        "region": "Delhi, India",
        "description": "India's capital city — a blend of ancient monuments and modern chaos.",
        "best_season": "October to March",
        "cover_image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        "tags": ["Heritage", "Food", "Photography"],
    },
    {
        "name": "Chandigarh",
        "region": "Punjab, India",
        "description": "India's most planned city — clean, green and beautifully organized.",
        "best_season": "October to March",
        "cover_image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "tags": ["Architecture", "Nature", "Food"],
    },
    {
        "name": "Jammu",
        "region": "Jammu & Kashmir, India",
        "description": "Gateway to Kashmir — known for temples, cuisine and the Vaishno Devi shrine.",
        "best_season": "October to March",
        "cover_image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "tags": ["Spiritual", "Food", "Heritage"],
    },
    {
        "name": "Kashmir",
        "region": "Jammu & Kashmir, India",
        "description": "Paradise on Earth. Snow-capped mountains, shikara rides on Dal Lake.",
        "best_season": "April to October",
        "cover_image": "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800",
        "tags": ["Nature", "Photography", "Adventure"],
    },
    {
        "name": "Manali",
        "region": "Himachal Pradesh, India",
        "description": "The adventure capital of India. Snow peaks, river valleys and cafes.",
        "best_season": "March to June",
        "cover_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
        "tags": ["Adventure", "Nature", "Photography"],
    },
    {
        "name": "Jaipur",
        "region": "Rajasthan, India",
        "description": "The Pink City. Majestic forts, vibrant bazaars and royal heritage.",
        "best_season": "October to March",
        "cover_image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        "tags": ["Heritage", "Photography", "Food"],
    },
]

# Create destinations
dest_map = {}
for d in destinations_data:
    existing = db.query(Destination).filter(Destination.name == d["name"]).first()
    if not existing:
        dest = Destination(**d)
        db.add(dest)
        db.commit()
        db.refresh(dest)
        dest_map[d["name"]] = dest
        print(f"  Created destination: {d['name']}")
    else:
        dest_map[d["name"]] = existing
        print(f"  Destination exists: {d['name']}")

print("\nSeeding routes...")

routes_data = [
    {
        "name": "Delhi to Kashmir",
        "source": "Delhi",
        "destination": "Kashmir",
        "transport_type": "Road",
        "duration_min": 6,
        "duration_max": 8,
        "distance_km": 830,
        "budget_min": 12000,
        "budget_max": 25000,
        "description": "Journey through the heart of India to paradise on earth. Traverse Chandigarh, Jammu, Patnitop and arrive at the breathtaking Kashmir Valley.",
        "cover_image": "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800",
        "tags": ["Nature", "Photography", "Adventure", "Family"],
        "dont_miss": [
            "Sunset at Dal Lake",
            "Shikara ride at dawn",
            "Vaishno Devi trek",
            "Patnitop snow in winter",
            "Gulmarg gondola ride",
        ],
        "highlights": {
            "best_food": "Jammu's Rajma Chawal at Kesar Da Dhaba",
            "best_photo": "Patnitop Valley Viewpoint at sunrise",
            "best_gem": "Surinsar Lake near Jammu",
            "best_family": "Vaishno Devi Shrine",
            "most_underrated": "Banihal Pass tunnel town",
        },
        "status": "published",
    },
    {
        "name": "Delhi to Manali",
        "source": "Delhi",
        "destination": "Manali",
        "transport_type": "Road",
        "duration_min": 4,
        "duration_max": 6,
        "distance_km": 540,
        "budget_min": 8000,
        "budget_max": 18000,
        "description": "The classic Himalayan road trip through Chandigarh, Mandi and Kullu.",
        "cover_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
        "tags": ["Adventure", "Nature", "Photography", "Budget"],
        "dont_miss": [
            "Rohtang Pass (seasonal)",
            "Solang Valley snow activities",
            "Old Manali cafe culture",
            "Hadimba Temple forest walk",
            "Beas River rafting",
        ],
        "highlights": {
            "best_food": "Siddu bread with ghee in Mandi",
            "best_photo": "Rohtang Pass panoramic view",
            "best_gem": "Naggar Castle viewpoint",
            "best_family": "Solang Valley",
            "most_underrated": "Prashar Lake trek from Mandi",
        },
        "status": "published",
    },
    {
        "name": "Delhi to Jaipur",
        "source": "Delhi",
        "destination": "Jaipur",
        "transport_type": "Road",
        "duration_min": 2,
        "duration_max": 3,
        "distance_km": 270,
        "budget_min": 5000,
        "budget_max": 15000,
        "description": "The Golden Triangle classic. Explore ancient step wells and the Pink City.",
        "cover_image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        "tags": ["Family", "Photography", "Food", "Budget"],
        "dont_miss": [
            "Chand Baori step well at Abhaneri",
            "Amber Fort elephant ride",
            "Hawa Mahal at golden hour",
            "Bapu Bazaar for local shopping",
            "Rooftop dining in old city",
        ],
        "highlights": {
            "best_food": "Dal Baati Churma at Laxmi Misthan Bhandar",
            "best_photo": "Hawa Mahal at sunrise",
            "best_gem": "Abhaneri Step Well",
            "best_family": "Amber Fort",
            "most_underrated": "Galta Ji Monkey Temple",
        },
        "status": "published",
    },
    {
        "name": "Delhi to Rishikesh",
        "source": "Delhi",
        "destination": "Rishikesh",
        "transport_type": "Road",
        "duration_min": 2,
        "duration_max": 3,
        "distance_km": 240,
        "budget_min": 4000,
        "budget_max": 12000,
        "description": "The yoga and adventure capital. Drive through Haridwar and arrive at the adventure hub.",
        "cover_image": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800",
        "tags": ["Adventure", "Nature", "Family", "Budget"],
        "dont_miss": [
            "Ganga Aarti at Haridwar",
            "Bungee jumping at Mohan Chatti",
            "White water rafting",
            "Laxman Jhula at sunset",
            "Beatles Ashram exploration",
        ],
        "highlights": {
            "best_food": "Chole Bhature at Haridwar Har Ki Pauri",
            "best_photo": "Laxman Jhula at dusk",
            "best_gem": "Neergarh Waterfall trek",
            "best_family": "Haridwar Ganga Aarti",
            "most_underrated": "Beatles Ashram graffiti walls",
        },
        "status": "published",
    },

    {
        "name": "Delhi to Shimla",
        "source": "Delhi",
        "destination": "Shimla",
        "transport_type": "Road",
        "duration_min": 2,
        "duration_max": 3,
        "distance_km": 370,
        "budget_min": 6000,
        "budget_max": 14000,
        "description": "The classic hill station escape. Drive through Chandigarh, Kalka and arrive at the Queen of Hills — colonial charm, toy train and snow-capped views.",
        "cover_image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        "tags": ["Nature", "Photography", "Family", "Budget"],
        "dont_miss": [
            "Toy train from Kalka to Shimla",
            "Mall Road evening walk",
            "Jakhu Temple monkey temple",
            "Kufri snow activities",
            "Sunrise from Prospect Hill",
        ],
        "highlights": {
            "best_food": "Himachali Dham thali at any local dhaba",
            "best_photo": "Sunrise view from Jakhu Hill",
            "best_gem": "Tara Devi Temple — almost no tourists",
            "best_family": "Kufri Fun World snow activities",
            "most_underrated": "Chail — 45km from Shimla, world's highest cricket ground",
        },
        "status": "published",
    },
    {
        "name": "Delhi to Agra",
        "source": "Delhi",
        "destination": "Agra",
        "transport_type": "Road",
        "duration_min": 1,
        "duration_max": 2,
        "distance_km": 210,
        "budget_min": 3000,
        "budget_max": 10000,
        "description": "India's most iconic day trip. The Yamuna Expressway makes it a 2.5 hour drive to see one of the Seven Wonders of the World.",
        "cover_image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
        "tags": ["Heritage", "Photography", "Family", "Budget"],
        "dont_miss": [
            "Taj Mahal at sunrise",
            "Agra Fort interior",
            "Mehtab Bagh sunset view",
            "Fatehpur Sikri ghost city",
            "Petha sweet from Agra",
        ],
        "highlights": {
            "best_food": "Petha and Bedai at Deviram Sweets",
            "best_photo": "Taj Mahal reflection pool at 6 AM",
            "best_gem": "Mehtab Bagh — sunset Taj view with no crowds",
            "best_family": "Agra Fort elephant gate entry",
            "most_underrated": "Itimad-ud-Daulah — Baby Taj with zero crowds",
        },
        "status": "published",
    },
]

# Create routes
route_map = {}
for r in routes_data:
    existing = db.query(Route).filter(Route.name == r["name"]).first()
    if not existing:
        route = Route(**r)
        db.add(route)
        db.commit()
        db.refresh(route)
        route_map[r["name"]] = route
        print(f"  Created route: {r['name']}")
    else:
        route_map[r["name"]] = existing
        print(f"  Route exists: {r['name']}")

print("\nSeeding stops for Delhi to Kashmir...")

kashmir_route = route_map.get("Delhi to Kashmir")
if kashmir_route:
    stops_data = [
        {
            "destination_name": "Delhi",
            "order": 1,
            "day_recommendation": "Day 1",
            "distance_from_prev": 0,
            "attractions": [
                {"name": "India Gate", "type": "attraction", "description": "Iconic war memorial and perfect evening walk spot", "tags": ["landmark", "evening"]},
                {"name": "Qutub Minar", "type": "attraction", "description": "UNESCO World Heritage minaret from 12th century", "tags": ["heritage", "photography"]},
                {"name": "Agrasen ki Baoli", "type": "hidden_gem", "description": "Ancient step well hidden in Connaught Place", "why_special": "A 60-step ancient well in the middle of modern Delhi — most tourists walk right past it", "tags": ["hidden", "photography"]},
            ],
            "food": [
                {"name": "Paranthe Wali Gali", "dish": "Stuffed Paranthas", "where": "Chandni Chowk", "price_range": "Budget", "description": "Try over 20 varieties of stuffed paranthas at this 100-year-old lane"},
            ],
            "tips": [
                {"text": "Start early from Delhi — avoid morning traffic by leaving before 7 AM", "category": "transport"},
                {"text": "The Delhi-Chandigarh expressway is excellent — fuel up before starting", "category": "transport"},
            ],
        },
        {
            "destination_name": "Chandigarh",
            "order": 2,
            "day_recommendation": "Day 1",
            "distance_from_prev": 250,
            "attractions": [
                {"name": "Rock Garden", "type": "attraction", "description": "Stunning sculpture garden made entirely from industrial waste", "tags": ["art", "unique"]},
                {"name": "Sukhna Lake", "type": "attraction", "description": "Man-made lake perfect for evening walks and boating", "tags": ["nature", "evening"]},
                {"name": "Zakir Hussain Rose Garden", "type": "hidden_gem", "description": "Asia's largest rose garden with 1600+ varieties", "why_special": "Almost no tourists — best kept secret of Chandigarh", "tags": ["nature", "photography"]},
            ],
            "food": [
                {"name": "Sector 17 Dhaba Row", "dish": "Butter Chicken", "where": "Sector 17 market", "price_range": "Mid-range", "description": "Original Punjabi butter chicken in the city that invented it"},
            ],
            "tips": [
                {"text": "Chandigarh is very well planned — sector numbers help navigation", "category": "general"},
            ],
        },
        {
            "destination_name": "Jammu",
            "order": 3,
            "day_recommendation": "Day 2",
            "distance_from_prev": 310,
            "attractions": [
                {"name": "Vaishno Devi Shrine", "type": "attraction", "description": "One of the most sacred Hindu shrines, 14km trek from Katra", "tags": ["spiritual", "trekking"]},
                {"name": "Raghunath Temple", "type": "attraction", "description": "Magnificent temple complex in the heart of Jammu city", "tags": ["spiritual", "heritage"]},
                {"name": "Surinsar Lake", "type": "hidden_gem", "description": "Twin lakes 42km from Jammu surrounded by dense forest", "why_special": "Pristine lake with zero crowds — most tourists skip this", "tags": ["nature", "hidden"]},
            ],
            "food": [
                {"name": "Kesar Da Dhaba", "dish": "Rajma Chawal", "where": "Jammu city", "price_range": "Budget", "description": "Famous for Jammu-style red kidney bean curry"},
            ],
            "tips": [
                {"text": "For Vaishno Devi, register at Katra RFID counter before starting trek", "category": "safety"},
                {"text": "Jammu is hot — visit October to March for pleasant weather", "category": "season"},
            ],
        },
    ]

    for stop_data in stops_data:
        dest = dest_map.get(stop_data["destination_name"])
        if not dest:
            continue

        existing_stop = db.query(Stop).filter(
            Stop.route_id == kashmir_route.id,
            Stop.order == stop_data["order"]
        ).first()

        if not existing_stop:
            stop = Stop(
                route_id=kashmir_route.id,
                destination_id=dest.id,
                order=stop_data["order"],
                day_recommendation=stop_data["day_recommendation"],
                distance_from_prev=stop_data["distance_from_prev"],
            )
            db.add(stop)
            db.commit()
            db.refresh(stop)

            # Add attractions
            for attr in stop_data.get("attractions", []):
                a = Attraction(
                    stop_id=stop.id,
                    name=attr["name"],
                    type=attr.get("type", "attraction"),
                    description=attr.get("description"),
                    why_special=attr.get("why_special"),
                    tags=attr.get("tags", []),
                )
                db.add(a)

            # Add food
            for food in stop_data.get("food", []):
                f = FoodItem(
                    stop_id=stop.id,
                    name=food.get("name"),
                    dish=food["dish"],
                    where=food.get("where"),
                    price_range=food.get("price_range"),
                    description=food.get("description"),
                )
                db.add(f)

            # Add tips
            for tip in stop_data.get("tips", []):
                t = Tip(
                    stop_id=stop.id,
                    text=tip["text"],
                    category=tip.get("category", "general"),
                )
                db.add(t)

            db.commit()
            print(f"  Created stop: {stop_data['destination_name']}")
        else:
            print(f"  Stop exists: {stop_data['destination_name']}")

print("\nSeeding itinerary for Delhi to Kashmir...")

if kashmir_route:
    existing_itin = db.query(Itinerary).filter(
        Itinerary.route_id == kashmir_route.id
    ).first()

    if not existing_itin:
        itin = Itinerary(
            route_id=kashmir_route.id,
            name="Classic Delhi to Kashmir Itinerary",
            total_days=7,
        )
        db.add(itin)
        db.commit()
        db.refresh(itin)

        days_data = [
            {
                "day_number": 1,
                "title": "Delhi Departure",
                "destination_name": "Delhi → Chandigarh",
                "activities": [
                    {"id": 1, "name": "Early morning departure from Delhi", "time_slot": "Morning", "type": "transport"},
                    {"id": 2, "name": "Visit Rock Garden in Chandigarh", "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 3, "name": "Sukhna Lake evening walk", "time_slot": "Evening", "type": "attraction"},
                    {"id": 4, "name": "Dinner at Sector 17 dhaba row", "time_slot": "Evening", "type": "food"},
                ],
            },
            {
                "day_number": 2,
                "title": "Into Jammu",
                "destination_name": "Chandigarh → Jammu",
                "activities": [
                    {"id": 5, "name": "Early breakfast and checkout", "time_slot": "Morning", "type": "general"},
                    {"id": 6, "name": "Drive to Jammu via NH44", "time_slot": "Morning", "type": "transport"},
                    {"id": 7, "name": "Raghunath Temple visit", "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 8, "name": "Rajma Chawal at Kesar Da Dhaba", "time_slot": "Afternoon", "type": "food"},
                ],
            },
            {
                "day_number": 3,
                "title": "Vaishno Devi Trek",
                "destination_name": "Katra → Vaishno Devi",
                "activities": [
                    {"id": 9, "name": "Drive to Katra base camp", "time_slot": "Morning", "type": "transport"},
                    {"id": 10, "name": "Register RFID at Katra", "time_slot": "Morning", "type": "general"},
                    {"id": 11, "name": "Begin Vaishno Devi trek (14km)", "time_slot": "Morning", "type": "attraction"},
                    {"id": 12, "name": "Darshan at the shrine", "time_slot": "Afternoon", "type": "spiritual"},
                ],
            },
        ]

        for day_data in days_data:
            day = ItineraryDay(
                itinerary_id=itin.id,
                day_number=day_data["day_number"],
                title=day_data["title"],
                destination_name=day_data["destination_name"],
                activities=day_data["activities"],
            )
            db.add(day)

        db.commit()
        print("  Created itinerary with 3 days")
    else:
        print("  Itinerary exists")

db.close()
print("\nSeed data complete!")
print("Visit http://localhost:8000/docs to test the APIs")