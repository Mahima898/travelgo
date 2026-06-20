from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.destination import Destination
from app.models.route import Route
from app.models.attraction import Stop, Attraction, FoodItem, Tip
from app.models.itinerary import Itinerary, ItineraryDay
from app.models.trip import Trip

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def get_or_create_destination(name, region, description,
                               best_season, cover_image, tags):
    dest = db.query(Destination).filter(
        Destination.name == name
    ).first()
    if not dest:
        dest = Destination(
            name=name, region=region,
            description=description,
            best_season=best_season,
            cover_image=cover_image,
            tags=tags,
        )
        db.add(dest)
        db.commit()
        db.refresh(dest)
        print(f"  Created destination: {name}")
    else:
        print(f"  Destination exists: {name}")
    return dest


def delete_stops_for_route(route_id):
    stops = db.query(Stop).filter(Stop.route_id == route_id).all()
    for stop in stops:
        db.delete(stop)
    db.commit()
    print(f"  Deleted {len(stops)} old stops")


def create_stop_with_content(route_id, dest_id, order, day_rec,
                              dist_prev, attractions, food, tips):
    stop = Stop(
        route_id=route_id,
        destination_id=dest_id,
        order=order,
        day_recommendation=day_rec,
        distance_from_prev=dist_prev,
    )
    db.add(stop)
    db.commit()
    db.refresh(stop)

    for a in attractions:
        attraction = Attraction(
            stop_id=stop.id,
            name=a["name"],
            type=a.get("type", "attraction"),
            description=a.get("description", ""),
            why_special=a.get("why_special", None),
            tags=a.get("tags", []),
            image=a.get("image", None),
        )
        db.add(attraction)

    for f in food:
        food_item = FoodItem(
            stop_id=stop.id,
            name=f.get("name", ""),
            dish=f["dish"],
            where=f.get("where", ""),
            price_range=f.get("price_range", "Budget"),
            description=f.get("description", ""),
            image=f.get("image", None),
        )
        db.add(food_item)

    for t in tips:
        tip = Tip(
            stop_id=stop.id,
            text=t["text"],
            category=t.get("category", "general"),
        )
        db.add(tip)

    db.commit()
    print(f"    Stop {order} created: {day_rec}")
    return stop


def delete_itinerary_for_route(route_id):
    itin = db.query(Itinerary).filter(
        Itinerary.route_id == route_id
    ).first()
    if itin:
        db.delete(itin)
        db.commit()
        print(f"  Deleted old itinerary")


def create_itinerary_for_route(route_id, name, total_days, days_data):
    itin = Itinerary(
        route_id=route_id,
        name=name,
        total_days=total_days,
    )
    db.add(itin)
    db.commit()
    db.refresh(itin)

    for day in days_data:
        itin_day = ItineraryDay(
            itinerary_id=itin.id,
            day_number=day["day_number"],
            title=day["title"],
            destination_name=day["destination_name"],
            activities=day["activities"],
        )
        db.add(itin_day)

    db.commit()
    print(f"  Created itinerary: {name}")
    return itin


print("\n== Creating Destinations ==")

delhi = get_or_create_destination(
    "Delhi", "Delhi, India",
    "India's capital — blend of ancient monuments and modern chaos.",
    "October to March",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=90",
    ["Heritage", "Food", "Photography"],
)
chandigarh = get_or_create_destination(
    "Chandigarh", "Punjab, India",
    "India's most planned city — clean, green and organized.",
    "October to March",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90",
    ["Architecture", "Nature", "Food"],
)
jammu = get_or_create_destination(
    "Jammu", "Jammu & Kashmir, India",
    "Gateway to Kashmir — temples, cuisine and Vaishno Devi.",
    "October to March",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90",
    ["Spiritual", "Food", "Heritage"],
)
kashmir = get_or_create_destination(
    "Kashmir", "Jammu & Kashmir, India",
    "Paradise on Earth — snow peaks, Dal Lake and saffron fields.",
    "April to October",
    "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=90",
    ["Nature", "Photography", "Adventure"],
)
manali = get_or_create_destination(
    "Manali", "Himachal Pradesh, India",
    "Adventure capital — snow peaks, river valleys and cafes.",
    "March to June",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=90",
    ["Adventure", "Nature", "Photography"],
)
jaipur = get_or_create_destination(
    "Jaipur", "Rajasthan, India",
    "The Pink City — forts, bazaars and royal heritage.",
    "October to March",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=90",
    ["Heritage", "Photography", "Food"],
)
agra = get_or_create_destination(
    "Agra", "Uttar Pradesh, India",
    "Home of the Taj Mahal — one of the seven wonders.",
    "October to March",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=90",
    ["Heritage", "Photography", "UNESCO"],
)
haridwar = get_or_create_destination(
    "Haridwar", "Uttarakhand, India",
    "Gateway to the Gods — sacred city on the Ganga.",
    "October to April",
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=90",
    ["Spiritual", "Nature", "Photography"],
)
rishikesh = get_or_create_destination(
    "Rishikesh", "Uttarakhand, India",
    "Yoga capital — adventure sports, ashrams and Ganga rafting.",
    "September to June",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=90",
    ["Adventure", "Spiritual", "Nature"],
)

print("\n== Getting Routes ==")

kashmir_route   = db.query(Route).filter(Route.name == "Delhi to Kashmir").first()
manali_route    = db.query(Route).filter(Route.name == "Delhi to Manali").first()
jaipur_route    = db.query(Route).filter(Route.name == "Delhi to Jaipur").first()
rishikesh_route = db.query(Route).filter(Route.name == "Delhi to Rishikesh").first()

for r in [kashmir_route, manali_route, jaipur_route, rishikesh_route]:
    if not r:
        print("ERROR: Route not found. Run seed_data.py first!")

if kashmir_route:
    print(f"\n== Delhi to Kashmir (id={kashmir_route.id}) ==")
    delete_stops_for_route(kashmir_route.id)
    delete_itinerary_for_route(kashmir_route.id)

    create_stop_with_content(
        route_id=kashmir_route.id,
        dest_id=delhi.id,
        order=1, day_rec="Day 1", dist_prev=0,
        attractions=[
            {
                "name": "India Gate",
                "type": "attraction",
                "description": "Iconic war memorial — perfect starting point before the long drive",
                "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=90",
                "tags": ["landmark", "evening"],
            },
            {
                "name": "Qutub Minar",
                "type": "attraction",
                "description": "UNESCO World Heritage 12th century minaret — stunning at sunset",
                "image": "https://images.unsplash.com/photo-1716747713381-ebdd06319cdd?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
            {
                "name": "Agrasen ki Baoli",
                "type": "hidden_gem",
                "description": "Ancient 60-step step well hidden in Connaught Place",
                "why_special": "Most tourists walk right past this 2000-year-old well in the middle of modern Delhi",
                "image": "https://images.unsplash.com/photo-1674822931086-e45ef563f833?w=800&q=90",
                "tags": ["hidden", "photography"],
            },
        ],
        food=[
            {
                "name": "Paranthe Wali Gali",
                "dish": "Stuffed Paranthas",
                "where": "Chandni Chowk, Delhi",
                "price_range": "Budget",
                "description": "100-year-old lane with 20+ varieties of stuffed paranthas",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
            {
                "name": "Karim's",
                "dish": "Mutton Korma",
                "where": "Jama Masjid, Old Delhi",
                "price_range": "Mid-range",
                "description": "Legendary Mughlai restaurant since 1913",
                "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Leave Delhi before 6 AM to avoid traffic on NH44", "category": "transport"},
            {"text": "Fill fuel at Delhi — next good fuel station is Karnal", "category": "transport"},
        ],
    )

    create_stop_with_content(
        route_id=kashmir_route.id,
        dest_id=chandigarh.id,
        order=2, day_rec="Day 1", dist_prev=250,
        attractions=[
            {
                "name": "Rock Garden",
                "type": "attraction",
                "description": "Stunning sculpture garden made entirely from industrial waste",
                "image": "https://images.unsplash.com/photo-1446292532430-3e76f6ab6444?w=800&q=90",
                "tags": ["art", "unique"],
            },
            {
                "name": "Sukhna Lake",
                "type": "attraction",
                "description": "Man-made lake perfect for evening walk and boating",
                "image": "https://images.unsplash.com/photo-1687850020094-65edaf8c33fb?w=800&q=90",
                "tags": ["nature", "evening"],
            },
            {
                "name": "Rose Garden",
                "type": "hidden_gem",
                "description": "Asia's largest rose garden with 1600+ varieties",
                "why_special": "Barely any tourists — best kept secret of Chandigarh",
                "image": "https://plus.unsplash.com/premium_photo-1703689520237-3667a9b43453?w=800&q=90",
                "tags": ["nature", "photography"],
            },
        ],
        food=[
            {
                "name": "Pal Dhaba",
                "dish": "Butter Chicken",
                "where": "Sector 28, Chandigarh",
                "price_range": "Mid-range",
                "description": "Original Punjabi butter chicken — legendary dhaba stop",
                "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Chandigarh is very well planned — sector numbers help navigation", "category": "general"},
            {"text": "Top up fuel here before entering hilly terrain", "category": "transport"},
        ],
    )

    create_stop_with_content(
        route_id=kashmir_route.id,
        dest_id=jammu.id,
        order=3, day_rec="Day 2", dist_prev=310,
        attractions=[
            {
                "name": "Vaishno Devi Shrine",
                "type": "attraction",
                "description": "One of the most sacred Hindu shrines — 14km trek from Katra",
                "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=90",
                "tags": ["spiritual", "trekking"],
            },
            {
                "name": "Raghunath Temple",
                "type": "attraction",
                "description": "Magnificent temple complex in the heart of Jammu city",
                "image": "https://images.unsplash.com/photo-1603766806347-54cdf3745953?w=800&q=90",
                "tags": ["spiritual", "heritage"],
            },
            {
                "name": "Surinsar Lake",
                "type": "hidden_gem",
                "description": "Twin lakes 42km from Jammu surrounded by dense forest",
                "why_special": "Pristine lake with zero crowds — most tourists skip this",
                "image": "https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?w=800&q=90",
                "tags": ["nature", "hidden"],
            },
        ],
        food=[
            {
                "name": "Kesar Da Dhaba",
                "dish": "Rajma Chawal",
                "where": "Jammu City",
                "price_range": "Budget",
                "description": "Famous for Jammu-style red kidney bean curry",
                "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=90",
            },
        ],
        tips=[
            {"text": "For Vaishno Devi, register RFID at Katra counter before trek — mandatory", "category": "safety"},
            {"text": "Jammu is very hot in summer — visit October to March", "category": "season"},
        ],
    )

    create_stop_with_content(
        route_id=kashmir_route.id,
        dest_id=kashmir.id,
        order=4, day_rec="Day 3", dist_prev=270,
        attractions=[
            {
                "name": "Dal Lake",
                "type": "attraction",
                "description": "Famous Himalayan lake — shikara rides at sunrise are magical",
                "image": "https://plus.unsplash.com/premium_photo-1674409427334-0ae5280381ee?w=800&q=90",
                "tags": ["nature", "photography"],
            },
            {
                "name": "Gulmarg",
                "type": "attraction",
                "description": "Asia's highest gondola ride and skiing destination",
                "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=90",
                "tags": ["adventure", "nature"],
            },
            {
                "name": "Tulip Garden",
                "type": "hidden_gem",
                "description": "Asia's largest tulip garden open only March-April",
                "why_special": "Only open 6 weeks a year — most tourists miss this completely",
                "image": "https://images.unsplash.com/photo-1559150182-a7144f7628f9?w=800&q=90",
                "tags": ["nature", "photography"],
            },
        ],
        food=[
            {
                "name": "Ahdoos Restaurant",
                "dish": "Rogan Josh",
                "where": "Residency Road, Srinagar",
                "price_range": "Mid-range",
                "description": "Best Wazwan cuisine in Srinagar since 1918",
                "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=90",
            },
            {
                "name": "Chai Khana",
                "dish": "Kahwa Tea",
                "where": "Dal Lake Shikara",
                "price_range": "Budget",
                "description": "Saffron green tea on a shikara — magical experience",
                "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Book houseboat on Dal Lake in advance — especially in summer peak season", "category": "general"},
            {"text": "Carry warm clothes even in summer — temperatures drop at night", "category": "packing"},
        ],
    )

    create_itinerary_for_route(
        route_id=kashmir_route.id,
        name="Classic Delhi to Kashmir Itinerary",
        total_days=7,
        days_data=[
            {
                "day_number": 1, "title": "Delhi Departure",
                "destination_name": "Delhi to Chandigarh",
                "activities": [
                    {"id": 1,  "name": "Early morning departure from Delhi", "time_slot": "Morning",   "type": "transport"},
                    {"id": 2,  "name": "Visit Rock Garden Chandigarh",       "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 3,  "name": "Sukhna Lake evening walk",           "time_slot": "Evening",   "type": "attraction"},
                    {"id": 4,  "name": "Dinner at Sector 17 dhaba row",      "time_slot": "Evening",   "type": "food"},
                ],
            },
            {
                "day_number": 2, "title": "Into Jammu",
                "destination_name": "Chandigarh to Jammu",
                "activities": [
                    {"id": 5,  "name": "Drive to Jammu via NH44",            "time_slot": "Morning",   "type": "transport"},
                    {"id": 6,  "name": "Raghunath Temple visit",             "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 7,  "name": "Rajma Chawal at Kesar Da Dhaba",     "time_slot": "Afternoon", "type": "food"},
                    {"id": 8,  "name": "Surinsar Lake evening visit",        "time_slot": "Evening",   "type": "hidden_gem"},
                ],
            },
            {
                "day_number": 3, "title": "Vaishno Devi Trek",
                "destination_name": "Katra to Vaishno Devi",
                "activities": [
                    {"id": 9,  "name": "Drive to Katra base camp",           "time_slot": "Morning",   "type": "transport"},
                    {"id": 10, "name": "Register RFID at Katra counter",     "time_slot": "Morning",   "type": "general"},
                    {"id": 11, "name": "Begin Vaishno Devi trek 14km",       "time_slot": "Morning",   "type": "attraction"},
                    {"id": 12, "name": "Darshan at the shrine",              "time_slot": "Afternoon", "type": "spiritual"},
                ],
            },
            {
                "day_number": 4, "title": "Drive to Srinagar",
                "destination_name": "Jammu to Srinagar",
                "activities": [
                    {"id": 13, "name": "Drive through Banihal tunnel",       "time_slot": "Morning",   "type": "transport"},
                    {"id": 14, "name": "Check in to Dal Lake houseboat",     "time_slot": "Afternoon", "type": "general"},
                    {"id": 15, "name": "Shikara ride at sunset",             "time_slot": "Evening",   "type": "attraction"},
                ],
            },
            {
                "day_number": 5, "title": "Srinagar Exploration",
                "destination_name": "Srinagar",
                "activities": [
                    {"id": 16, "name": "Sunrise shikara ride on Dal Lake",   "time_slot": "Morning",   "type": "attraction"},
                    {"id": 17, "name": "Mughal Gardens visit",               "time_slot": "Morning",   "type": "attraction"},
                    {"id": 18, "name": "Wazwan lunch at Ahdoos",             "time_slot": "Afternoon", "type": "food"},
                    {"id": 19, "name": "Old City spice market walk",         "time_slot": "Afternoon", "type": "attraction"},
                ],
            },
            {
                "day_number": 6, "title": "Gulmarg Day Trip",
                "destination_name": "Gulmarg",
                "activities": [
                    {"id": 20, "name": "Drive to Gulmarg 56km",              "time_slot": "Morning",   "type": "transport"},
                    {"id": 21, "name": "Gondola ride Phase 1 and 2",         "time_slot": "Morning",   "type": "attraction"},
                    {"id": 22, "name": "Snow activities at Apharwat Peak",   "time_slot": "Afternoon", "type": "adventure"},
                ],
            },
            {
                "day_number": 7, "title": "Return Journey",
                "destination_name": "Srinagar to Delhi",
                "activities": [
                    {"id": 23, "name": "Last morning Kahwa tea on shikara",  "time_slot": "Morning",   "type": "food"},
                    {"id": 24, "name": "Lal Chowk souvenir shopping",        "time_slot": "Morning",   "type": "general"},
                    {"id": 25, "name": "Flight back to Delhi",               "time_slot": "Afternoon", "type": "transport"},
                ],
            },
        ],
    )


# ============================================================
# ROUTE 2 — DELHI TO MANALI
# ============================================================
if manali_route:
    print(f"\n== Delhi to Manali (id={manali_route.id}) ==")
    delete_stops_for_route(manali_route.id)
    delete_itinerary_for_route(manali_route.id)

    create_stop_with_content(
        route_id=manali_route.id,
        dest_id=delhi.id,
        order=1, day_rec="Day 1", dist_prev=0,
        attractions=[
            {
                "name": "India Gate",
                "type": "attraction",
                "description": "Iconic war memorial — perfect start before the highway",
                "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=90",
                "tags": ["landmark"],
            },
            {
                "name": "Lodhi Garden",
                "type": "hidden_gem",
                "description": "Ancient tombs inside a peaceful city garden",
                "why_special": "Free, serene and almost no tourists — Delhi's best kept secret",
                "image": "https://images.unsplash.com/photo-1715633743194-14db1edb294c?w=800&q=90",
                "tags": ["hidden", "nature"],
            },
        ],
        food=[
            {
                "name": "Paranthe Wali Gali",
                "dish": "Stuffed Paranthas",
                "where": "Chandni Chowk",
                "price_range": "Budget",
                "description": "Best breakfast before the long Manali drive",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Start before 5 AM — NH44 traffic is brutal after 7 AM", "category": "transport"},
            {"text": "Download offline maps — network is spotty after Mandi", "category": "general"},
        ],
    )

    create_stop_with_content(
        route_id=manali_route.id,
        dest_id=chandigarh.id,
        order=2, day_rec="Day 1", dist_prev=250,
        attractions=[
            {
                "name": "Rock Garden",
                "type": "attraction",
                "description": "Perfect 1 hour stopover — unique art garden",
                "image": "https://plus.unsplash.com/premium_photo-1749660403610-ad075c9be5e3?w=800&q=90",
                "tags": ["art"],
            },
            {
                "name": "Capitol Complex",
                "type": "hidden_gem",
                "description": "Le Corbusier's UNESCO masterpiece architecture",
                "why_special": "World class architecture that most highway travelers completely miss",
                "image": "https://images.unsplash.com/photo-1760054332688-fa924575993f?w=800&q=90",
                "tags": ["architecture", "photography"],
            },
        ],
        food=[
            {
                "name": "Pal Dhaba",
                "dish": "Butter Chicken Naan",
                "where": "Sector 28, Chandigarh",
                "price_range": "Mid-range",
                "description": "Best pit stop meal before the mountain drive",
                "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Top up fuel here — next reliable fuel station is Mandi 200km away", "category": "transport"},
            {"text": "ATM in Chandigarh — Manali ATMs run out of cash on weekends", "category": "general"},
        ],
    )

    create_stop_with_content(
        route_id=manali_route.id,
        dest_id=manali.id,
        order=3, day_rec="Day 2", dist_prev=290,
        attractions=[
            {
                "name": "Hadimba Temple",
                "type": "attraction",
                "description": "Ancient wooden temple inside cedar forest — 500 years old",
                "image": "https://plus.unsplash.com/premium_photo-1697730116501-72f5749dffce?w=800&q=90",
                "tags": ["spiritual", "nature"],
            },
            {
                "name": "Solang Valley",
                "type": "attraction",
                "description": "Snow activities, paragliding and cable car rides",
                "image": "https://images.unsplash.com/photo-1675515642342-2c55067d51d5?w=800&q=90",
                "tags": ["adventure", "photography"],
            },
            {
                "name": "Rohtang Pass",
                "type": "attraction",
                "description": "Snow at 13,000 feet — requires permit seasonal",
                "image": "https://plus.unsplash.com/premium_photo-1697729680546-2ef72b3073e9?w=800&q=90",
                "tags": ["adventure", "scenic"],
            },
            {
                "name": "Naggar Castle",
                "type": "hidden_gem",
                "description": "15th century stone castle with panoramic valley views",
                "why_special": "Only 20km from Manali — better Himalayan views than Manali town",
                "image": "https://plus.unsplash.com/premium_photo-1694475547624-f7ad4d8a1b70?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
        ],
        food=[
            {
                "name": "Drifters Cafe",
                "dish": "Siddu with Ghee",
                "where": "Old Manali Market",
                "price_range": "Budget",
                "description": "Traditional Himachali bread — local specialty you cannot miss",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
            {
                "name": "Johnsons Cafe",
                "dish": "Trout Fish Curry",
                "where": "Circuit House Road, Manali",
                "price_range": "Mid-range",
                "description": "Famous for fresh Kullu trout from local rivers",
                "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Rohtang Pass permit must be booked online 1 day before", "category": "safety"},
            {"text": "Old Manali is better than Mall Road — more authentic and cheaper", "category": "general"},
            {"text": "Carry warm clothes even in summer — cold at Rohtang Pass", "category": "packing"},
        ],
    )

    create_itinerary_for_route(
        route_id=manali_route.id,
        name="Delhi to Manali Adventure Itinerary",
        total_days=5,
        days_data=[
            {
                "day_number": 1, "title": "Delhi to Chandigarh",
                "destination_name": "Delhi to Chandigarh",
                "activities": [
                    {"id": 1, "name": "Early departure from Delhi before 5 AM", "time_slot": "Early Morning", "type": "transport"},
                    {"id": 2, "name": "Breakfast at Paranthe Wali Gali",        "time_slot": "Morning",       "type": "food"},
                    {"id": 3, "name": "Rock Garden Chandigarh stopover",        "time_slot": "Afternoon",     "type": "attraction"},
                    {"id": 4, "name": "Lunch at Pal Dhaba Sector 28",           "time_slot": "Afternoon",     "type": "food"},
                    {"id": 5, "name": "Overnight drive to Manali",              "time_slot": "Evening",       "type": "transport"},
                ],
            },
            {
                "day_number": 2, "title": "Arrive Manali",
                "destination_name": "Chandigarh to Manali",
                "activities": [
                    {"id": 6, "name": "Arrive Manali and rest",                 "time_slot": "Morning",   "type": "general"},
                    {"id": 7, "name": "Hadimba Temple visit",                   "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 8, "name": "Old Manali market walk",                 "time_slot": "Evening",   "type": "general"},
                    {"id": 9, "name": "Siddu dinner at Drifters Cafe",          "time_slot": "Evening",   "type": "food"},
                ],
            },
            {
                "day_number": 3, "title": "Rohtang Pass",
                "destination_name": "Manali to Rohtang Pass",
                "activities": [
                    {"id": 10, "name": "Early drive to Rohtang Pass",           "time_slot": "Morning",   "type": "transport"},
                    {"id": 11, "name": "Snow activities at Rohtang",            "time_slot": "Morning",   "type": "adventure"},
                    {"id": 12, "name": "Solang Valley cable car",               "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 13, "name": "Paragliding at Solang",                 "time_slot": "Afternoon", "type": "adventure"},
                ],
            },
            {
                "day_number": 4, "title": "Naggar and Kullu",
                "destination_name": "Naggar to Kullu",
                "activities": [
                    {"id": 14, "name": "Naggar Castle visit",                   "time_slot": "Morning",   "type": "hidden_gem"},
                    {"id": 15, "name": "Kullu Shawl factory shopping",          "time_slot": "Afternoon", "type": "general"},
                    {"id": 16, "name": "Beas River sunset point",               "time_slot": "Evening",   "type": "attraction"},
                ],
            },
            {
                "day_number": 5, "title": "Return to Delhi",
                "destination_name": "Manali to Delhi",
                "activities": [
                    {"id": 17, "name": "Early morning departure from Manali",   "time_slot": "Morning",   "type": "transport"},
                    {"id": 18, "name": "Trout lunch at Johnsons Cafe",          "time_slot": "Afternoon", "type": "food"},
                    {"id": 19, "name": "Drive back to Delhi via Chandigarh",    "time_slot": "Evening",   "type": "transport"},
                ],
            },
        ],
    )


if jaipur_route:
    print(f"\n== Delhi to Jaipur (id={jaipur_route.id}) ==")
    delete_stops_for_route(jaipur_route.id)
    delete_itinerary_for_route(jaipur_route.id)

    create_stop_with_content(
        route_id=jaipur_route.id,
        dest_id=delhi.id,
        order=1, day_rec="Day 1", dist_prev=0,
        attractions=[
            {
                "name": "Humayuns Tomb",
                "type": "attraction",
                "description": "Magnificent Mughal tomb — UNESCO World Heritage Site",
                "image": "https://images.unsplash.com/photo-1695293351566-1dc582acc504?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
            {
                "name": "Lodhi Garden",
                "type": "hidden_gem",
                "description": "Ancient tombs inside a peaceful city garden",
                "why_special": "Free, serene and almost no tourists — Delhi's best kept secret",
                "image": "https://images.unsplash.com/photo-1715619981579-e98a43751a8a?w=800&q=90",
                "tags": ["hidden", "nature"],
            },
        ],
        food=[
            {
                "name": "Haldirams",
                "dish": "Kachori Sabji",
                "where": "Chandni Chowk, Delhi",
                "price_range": "Budget",
                "description": "Famous breakfast before the Jaipur drive",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Delhi-Jaipur NH48 expressway — 4 hour smooth drive", "category": "transport"},
            {"text": "Stop at Neemrana Fort midway — stunning 15th century fort hotel", "category": "general"},
        ],
    )

    create_stop_with_content(
        route_id=jaipur_route.id,
        dest_id=agra.id,
        order=2, day_rec="Day 1", dist_prev=200,
        attractions=[
            {
                "name": "Taj Mahal",
                "type": "attraction",
                "description": "One of the Seven Wonders — visit at sunrise for best experience",
                "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=90",
                "tags": ["heritage", "photography", "UNESCO"],
            },
            {
                "name": "Agra Fort",
                "type": "attraction",
                "description": "Massive Mughal fort with views of Taj Mahal",
                "image": "https://images.unsplash.com/photo-1591018653367-9c01498b3320?w=800&q=90",
                "tags": ["heritage"],
            },
            {
                "name": "Mehtab Bagh",
                "type": "hidden_gem",
                "description": "Garden on opposite riverbank from Taj Mahal",
                "why_special": "Best sunset view of Taj Mahal with almost no crowds",
                "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=90",
                "tags": ["hidden", "photography"],
            },
        ],
        food=[
            {
                "name": "Pind Balluchi",
                "dish": "Mughlai Biryani",
                "where": "Fatehabad Road, Agra",
                "price_range": "Mid-range",
                "description": "Best biryani near Taj Mahal",
                "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Taj Mahal tickets — book online, no ticket at gate on weekends", "category": "safety"},
            {"text": "Visit Taj at sunrise 6 AM — least crowds and best golden light", "category": "general"},
            {"text": "Friday is closed at Taj Mahal — plan accordingly", "category": "season"},
        ],
    )

    create_stop_with_content(
        route_id=jaipur_route.id,
        dest_id=jaipur.id,
        order=3, day_rec="Day 2", dist_prev=240,
        attractions=[
            {
                "name": "Amber Fort",
                "type": "attraction",
                "description": "Majestic 16th century fort — elephant ride and light show",
                "image": "https://images.unsplash.com/photo-1649073868642-bcbbd06239d8?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
            {
                "name": "Hawa Mahal",
                "type": "attraction",
                "description": "Palace of Winds — iconic pink honeycomb facade",
                "image": "https://images.unsplash.com/photo-1695395550316-8995ae9d35ff?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
            {
                "name": "Abhaneri Step Well",
                "type": "hidden_gem",
                "description": "Chand Baori — 3500 steps, 13 stories deep",
                "why_special": "65km from Jaipur but absolutely worth it — most dramatic step well in India",
                "image": "https://images.unsplash.com/photo-1615821593654-b8a80687a437?w=800&q=90",
                "tags": ["hidden", "photography", "architecture"],
            },
        ],
        food=[
            {
                "name": "LMB Restaurant",
                "dish": "Dal Baati Churma",
                "where": "Johari Bazaar, Jaipur",
                "price_range": "Mid-range",
                "description": "Most famous Rajasthani thali restaurant since 1727",
                "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=90",
            },
            {
                "name": "Rawat Mishtan",
                "dish": "Pyaaz Kachori",
                "where": "Station Road, Jaipur",
                "price_range": "Budget",
                "description": "Best kachori in Jaipur — always a long queue",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Jaipur Composite ticket covers 5 forts — buy it to save money", "category": "general"},
            {"text": "Best time is October to March — avoid April-June extreme heat", "category": "season"},
        ],
    )

    create_itinerary_for_route(
        route_id=jaipur_route.id,
        name="Delhi to Jaipur Golden Triangle Itinerary",
        total_days=3,
        days_data=[
            {
                "day_number": 1, "title": "Delhi to Agra",
                "destination_name": "Delhi to Agra",
                "activities": [
                    {"id": 1, "name": "Early drive to Agra from Delhi",      "time_slot": "Morning",   "type": "transport"},
                    {"id": 2, "name": "Taj Mahal sunrise visit",             "time_slot": "Morning",   "type": "attraction"},
                    {"id": 3, "name": "Agra Fort exploration",               "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 4, "name": "Mehtab Bagh sunset view of Taj",      "time_slot": "Evening",   "type": "hidden_gem"},
                ],
            },
            {
                "day_number": 2, "title": "Agra to Jaipur",
                "destination_name": "Agra to Jaipur",
                "activities": [
                    {"id": 5, "name": "Fatehpur Sikri en route to Jaipur",  "time_slot": "Morning",   "type": "attraction"},
                    {"id": 6, "name": "Arrive Jaipur check in",             "time_slot": "Afternoon", "type": "general"},
                    {"id": 7, "name": "Hawa Mahal at golden hour",          "time_slot": "Evening",   "type": "attraction"},
                    {"id": 8, "name": "Dal Baati Churma at LMB",            "time_slot": "Evening",   "type": "food"},
                ],
            },
            {
                "day_number": 3, "title": "Jaipur Exploration",
                "destination_name": "Jaipur",
                "activities": [
                    {"id": 9,  "name": "Amber Fort morning visit",          "time_slot": "Morning",   "type": "attraction"},
                    {"id": 10, "name": "City Palace and Jantar Mantar",     "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 11, "name": "Bapu Bazaar shopping",              "time_slot": "Afternoon", "type": "general"},
                    {"id": 12, "name": "Drive back to Delhi",               "time_slot": "Evening",   "type": "transport"},
                ],
            },
        ],
    )


if rishikesh_route:
    print(f"\n== Delhi to Rishikesh (id={rishikesh_route.id}) ==")
    delete_stops_for_route(rishikesh_route.id)
    delete_itinerary_for_route(rishikesh_route.id)

    create_stop_with_content(
        route_id=rishikesh_route.id,
        dest_id=delhi.id,
        order=1, day_rec="Day 1", dist_prev=0,
        attractions=[
            {
                "name": "ISKCON Temple Delhi",
                "type": "attraction",
                "description": "Beautiful Krishna temple — perfect spiritual start before Rishikesh",
                "image": "https://images.unsplash.com/photo-1697192047329-fa74f6a95dc2?w=800&q=90",
                "tags": ["spiritual"],
            },
            {
                "name": "Lodhi Garden",
                "type": "hidden_gem",
                "description": "Peaceful garden with ancient tombs and jogging paths",
                "why_special": "Free and almost crowd-free — perfect morning stop before highway",
                "image": "https://plus.unsplash.com/premium_photo-1678655852239-e6240e7192a6?w=800&q=90",
                "tags": ["hidden", "nature"],
            },
        ],
        food=[
            {
                "name": "Sarvana Bhavan",
                "dish": "Idli Vada Sambar",
                "where": "Connaught Place, Delhi",
                "price_range": "Budget",
                "description": "Best South Indian breakfast before the drive",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Start by 7 AM to reach Haridwar for evening Ganga Aarti at 6 PM", "category": "general"},
            {"text": "Delhi-Haridwar NH58 is smooth — 4.5 hours drive", "category": "transport"},
        ],
    )

    create_stop_with_content(
        route_id=rishikesh_route.id,
        dest_id=haridwar.id,
        order=2, day_rec="Day 1", dist_prev=210,
        attractions=[
            {
                "name": "Har Ki Pauri",
                "type": "attraction",
                "description": "Most sacred ghat — Ganga Aarti at 6 PM is magical",
                "image": "https://images.unsplash.com/photo-1653392083932-d5e9e7d2ccd1?w=800&q=90",
                "tags": ["spiritual", "photography"],
            },
            {
                "name": "Mansa Devi Temple",
                "type": "attraction",
                "description": "Hilltop temple reached by cable car with panoramic views",
                "image": "https://plus.unsplash.com/premium_photo-1691031429427-97978a028467?w=800&q=90",
                "tags": ["spiritual"],
            },
            {
                "name": "Maya Devi Temple",
                "type": "hidden_gem",
                "description": "Ancient powerful Shakti temple in the heart of old city",
                "why_special": "One of India's 12 Shakti Peeths that most tourists completely miss",
                "image": "https://images.unsplash.com/photo-1578235107258-f6e405a4ffc0?w=800&q=90",
                "tags": ["hidden", "spiritual"],
            },
        ],
        food=[
            {
                "name": "Chotiwala Restaurant",
                "dish": "Chole Bhature",
                "where": "Har Ki Pauri Road, Haridwar",
                "price_range": "Budget",
                "description": "Most famous restaurant in Haridwar since 1937",
                "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Ganga Aarti at Har Ki Pauri — reach by 5:30 PM for good spot", "category": "general"},
            {"text": "No non-veg and no alcohol in Haridwar — strictly enforced", "category": "general"},
        ],
    )

    create_stop_with_content(
        route_id=rishikesh_route.id,
        dest_id=rishikesh.id,
        order=3, day_rec="Day 2", dist_prev=24,
        attractions=[
            {
                "name": "Laxman Jhula",
                "type": "attraction",
                "description": "Iconic suspension bridge over Ganga — beautiful at sunset",
                "image": "https://images.unsplash.com/photo-1718383538820-524dd564fd06?w=800&q=90",
                "tags": ["photography", "landmark"],
            },
            {
                "name": "Triveni Ghat",
                "type": "attraction",
                "description": "Evening Ganga Aarti — more peaceful than Haridwar",
                "image": "https://images.unsplash.com/photo-1719644584112-e046e7fa23c4?w=800&q=90",
                "tags": ["spiritual", "photography"],
            },
            {
                "name": "Beatles Ashram",
                "type": "hidden_gem",
                "description": "Abandoned ashram where Beatles stayed in 1968 — stunning graffiti art",
                "why_special": "Incredible graffiti murals inside jungle ruins — most tourists skip this",
                "image": "https://images.unsplash.com/photo-1609786323851-b247ac61f096?w=800&q=90",
                "tags": ["hidden", "photography", "music"],
            },
            {
                "name": "Neergarh Waterfall",
                "type": "hidden_gem",
                "description": "Hidden waterfall 6km from Rishikesh — 3 tiered cascade",
                "why_special": "Only 30 min walk from road — almost zero tourists even in peak season",
                "image": "https://images.unsplash.com/photo-1482685945432-29a7abf2f466?w=800&q=90",
                "tags": ["hidden", "nature", "trekking"],
            },
        ],
        food=[
            {
                "name": "The Bistro",
                "dish": "Banana Pancakes",
                "where": "Laxman Jhula Road, Rishikesh",
                "price_range": "Budget",
                "description": "Most popular backpacker cafe in Rishikesh",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
            {
                "name": "Little Buddha Cafe",
                "dish": "Masala Chai and Maggi",
                "where": "Ram Jhula, Rishikesh",
                "price_range": "Budget",
                "description": "Iconic cafe on the banks of Ganga — best views",
                "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=90",
            },
        ],
        tips=[
            {"text": "White water rafting — book 2 days before for Grade 3-4 rapids", "category": "general"},
            {"text": "Rishikesh is fully vegetarian and no alcohol", "category": "general"},
            {"text": "Best season September to June — avoid July-August monsoon", "category": "season"},
        ],
    )

    create_itinerary_for_route(
        route_id=rishikesh_route.id,
        name="Delhi to Rishikesh Adventure Itinerary",
        total_days=3,
        days_data=[
            {
                "day_number": 1, "title": "Delhi to Haridwar",
                "destination_name": "Delhi to Haridwar",
                "activities": [
                    {"id": 1, "name": "Morning drive from Delhi",              "time_slot": "Morning",   "type": "transport"},
                    {"id": 2, "name": "Mansa Devi Temple cable car",          "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 3, "name": "Chole Bhature at Chotiwala",           "time_slot": "Afternoon", "type": "food"},
                    {"id": 4, "name": "Ganga Aarti at Har Ki Pauri",          "time_slot": "Evening",   "type": "spiritual"},
                    {"id": 5, "name": "Drive to Rishikesh and check in",      "time_slot": "Evening",   "type": "transport"},
                ],
            },
            {
                "day_number": 2, "title": "Rishikesh Adventure",
                "destination_name": "Rishikesh",
                "activities": [
                    {"id": 6, "name": "White water rafting on Ganga",         "time_slot": "Morning",   "type": "adventure"},
                    {"id": 7, "name": "Beatles Ashram exploration",           "time_slot": "Afternoon", "type": "hidden_gem"},
                    {"id": 8, "name": "Laxman Jhula sunset walk",             "time_slot": "Evening",   "type": "attraction"},
                    {"id": 9, "name": "Dinner at Little Buddha Cafe",         "time_slot": "Evening",   "type": "food"},
                ],
            },
            {
                "day_number": 3, "title": "Yoga and Return",
                "destination_name": "Rishikesh to Delhi",
                "activities": [
                    {"id": 10, "name": "Morning yoga session at ashram",      "time_slot": "Morning",   "type": "spiritual"},
                    {"id": 11, "name": "Neergarh Waterfall trek",             "time_slot": "Morning",   "type": "hidden_gem"},
                    {"id": 12, "name": "Triveni Ghat Aarti",                  "time_slot": "Afternoon", "type": "spiritual"},
                    {"id": 13, "name": "Drive back to Delhi",                 "time_slot": "Afternoon", "type": "transport"},
                ],
            },
        ],
    )


shimla_route = db.query(Route).filter(Route.name == "Delhi to Shimla").first()

shimla = get_or_create_destination(
    "Shimla", "Himachal Pradesh, India",
    "Queen of Hills — colonial charm, toy train and snow-capped Himalayan views.",
    "October to June",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=90",
    ["Nature", "Photography", "Family"],
)

if shimla_route:
    print(f"\n== Delhi to Shimla (id={shimla_route.id}) ==")
    delete_stops_for_route(shimla_route.id)
    delete_itinerary_for_route(shimla_route.id)

    create_stop_with_content(
        route_id=shimla_route.id,
        dest_id=delhi.id,
        order=1, day_rec="Day 1", dist_prev=0,
        attractions=[
            {
                "name": "India Gate",
                "type": "attraction",
                "description": "Start your Shimla trip with a quick morning visit",
                "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=90",
                "tags": ["landmark"],
            },
            
            {
                "name": "Lodhi Garden",
                "type": "hidden_gem",
                "description": "Ancient Mughal tombs inside a peaceful city garden — free entry",
                "why_special": "Free, serene and almost no tourists — Delhi's best kept secret for locals",
                "image": "https://plus.unsplash.com/premium_photo-1678655852239-e6240e7192a6?w=800&q=90",
                "tags": ["hidden", "nature", "heritage"],
            },
           {
                "name": "Agrasen ki Baoli",
                "type": "hidden_gem",
                "description": "Ancient 60-step step well hidden in the middle of Connaught Place",
                "why_special": "2000-year-old step well surrounded by modern Delhi — most tourists never find it",
                "image": "https://images.unsplash.com/photo-1677643096169-a9d1ab886510?w=800&q=90",
                "tags": ["hidden", "photography", "heritage"],
            },
        ],
        food=[
            {
                "name": "Paranthe Wali Gali",
                "dish": "Stuffed Paranthas",
                "where": "Chandni Chowk, Delhi",
                "price_range": "Budget",
                "description": "Perfect breakfast before the Shimla drive",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Leave Delhi by 6 AM — reach Shimla before sunset", "category": "transport"},
            {"text": "Yamuna Expressway to NH48 — smooth 5 hour drive", "category": "transport"},
        ],
    )

    create_stop_with_content(
        route_id=shimla_route.id,
        dest_id=chandigarh.id,
        order=2, day_rec="Day 1", dist_prev=250,
        attractions=[
            {
                "name": "Rock Garden",
                "type": "attraction",
                "description": "Quick 45 min stop — unique sculpture garden",
                "image": "https://images.unsplash.com/photo-1714381638678-b031170ea7c5?w=800&q=90",
                "tags": ["art"],
            },
           {
                "name": "Rose Garden",
                "type": "hidden_gem",
                "description": "Asia's largest rose garden with 1600+ varieties of roses",
                "why_special": "Almost no tourists visit this — best kept secret of Chandigarh city",
                "image": "https://images.unsplash.com/photo-1572085313466-6710de8d7ba3?w=800&q=90",
                "tags": ["hidden", "nature", "photography"],
            },
           {
              "name": "Leisure Valley",
              "type": "hidden_gem",
              "description": "8km long linear park connecting multiple gardens across the city",
              "why_special": "Locals love this but zero tourists know about it — peaceful green escape",
              "image": "https://images.unsplash.com/photo-1695274329099-d09ad64727fa?w=800&q=90",
              "tags": ["hidden", "nature"],
          },
        ],
          
              
        food=[
            {
                "name": "Pal Dhaba",
                "dish": "Butter Chicken",
                "where": "Sector 28, Chandigarh",
                "price_range": "Mid-range",
                "description": "Last proper Punjabi meal before mountains",
                "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Top up fuel at Chandigarh — mountain roads ahead", "category": "transport"},
        ],
    )

    create_stop_with_content(
        route_id=shimla_route.id,
        dest_id=shimla.id,
        order=3, day_rec="Day 2", dist_prev=120,
        attractions=[
            {
                "name": "Mall Road",
                "type": "attraction",
                "description": "Heart of Shimla — colonial buildings, shops and mountain views",
                "image": "https://images.unsplash.com/photo-1682693690771-2afadb405bd6?w=800&q=90",
                "tags": ["heritage", "evening"],
            },
            {
                "name": "Jakhu Temple",
                "type": "attraction",
                "description": "Ancient Hanuman temple on the highest peak with panoramic views",
                "image": "https://plus.unsplash.com/premium_photo-1694475136007-14c4dbf484f5?w=800&q=90",
                "tags": ["spiritual", "photography"],
            },
            {
                "name": "Kufri",
                "type": "attraction",
                "description": "Snow activities and Himalayan views — 16km from Shimla",
                "image": "https://images.unsplash.com/photo-1684991351891-018a35a91b36?w=800&q=90",
                "tags": ["adventure", "nature"],
            },
            {
                "name": "Chail",
                "type": "hidden_gem",
                "description": "World's highest cricket ground — 45km from Shimla",
                "why_special": "A palace, cricket ground and forest all in one — most tourists never come here",
                "image": "https://images.unsplash.com/photo-1593189530334-8e3036d6499a?w=800&q=90",
                "tags": ["hidden", "nature"],
            },
            {
                "name": "Tara Devi Temple",
                "type": "hidden_gem",
                "description": "Ancient goddess temple on a forested hill",
                "why_special": "Only 11km from Shimla but barely any tourists — peaceful and stunning views",
                "image": "https://images.unsplash.com/photo-1650706394148-8ad475f6a8da?w=800&q=90",
                "tags": ["hidden", "spiritual"],
            },
        ],
        food=[
            {
                "name": "Himani Restaurant",
                "dish": "Himachali Dham Thali",
                "where": "Mall Road, Shimla",
                "price_range": "Budget",
                "description": "Traditional Himachali feast — rice, dal, rajma, madra and bodi",
                "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=90",
            },
            {
                "name": "Cafe Simla Times",
                "dish": "Sidu Bread with Butter",
                "where": "Near Scandal Point",
                "price_range": "Budget",
                "description": "Traditional Himachali bread — warm and filling in the cold",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Toy train from Kalka to Shimla — book tickets on IRCTC 30 days in advance", "category": "general"},
            {"text": "Carry warm clothes even in summer — evenings get very cold", "category": "packing"},
            {"text": "Best season October-November for clear sky and snow views", "category": "season"},
        ],
    )

    create_itinerary_for_route(
        route_id=shimla_route.id,
        name="Delhi to Shimla Hill Station Itinerary",
        total_days=3,
        days_data=[
            {
                "day_number": 1, "title": "Drive to Shimla",
                "destination_name": "Delhi to Shimla via Chandigarh",
                "activities": [
                    {"id": 1, "name": "Early departure from Delhi", "time_slot": "Morning", "type": "transport"},
                    {"id": 2, "name": "Rock Garden stopover Chandigarh", "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 3, "name": "Arrive Shimla and Mall Road walk", "time_slot": "Evening", "type": "attraction"},
                    {"id": 4, "name": "Himachali Dham dinner", "time_slot": "Evening", "type": "food"},
                ],
            },
            {
                "day_number": 2, "title": "Shimla Exploration",
                "destination_name": "Shimla",
                "activities": [
                    {"id": 5, "name": "Jakhu Temple sunrise hike", "time_slot": "Morning", "type": "attraction"},
                    {"id": 6, "name": "Kufri snow activities", "time_slot": "Afternoon", "type": "adventure"},
                    {"id": 7, "name": "Tara Devi Temple hidden gem", "time_slot": "Afternoon", "type": "hidden_gem"},
                    {"id": 8, "name": "Mall Road evening shopping", "time_slot": "Evening", "type": "general"},
                ],
            },
            {
                "day_number": 3, "title": "Chail and Return",
                "destination_name": "Chail to Delhi",
                "activities": [
                    {"id": 9, "name": "Chail Palace and cricket ground", "time_slot": "Morning", "type": "hidden_gem"},
                    {"id": 10, "name": "Drive back to Delhi", "time_slot": "Afternoon", "type": "transport"},
                ],
            },
        ],
    )


agra_route = db.query(Route).filter(Route.name == "Delhi to Agra").first()

if agra_route:
    print(f"\n== Delhi to Agra (id={agra_route.id}) ==")
    delete_stops_for_route(agra_route.id)
    delete_itinerary_for_route(agra_route.id)

    create_stop_with_content(
        route_id=agra_route.id,
        dest_id=delhi.id,
        order=1, day_rec="Day 1", dist_prev=0,
        attractions=[
            {
                "name": "Humayuns Tomb",
                "type": "attraction",
                "description": "Mughal architecture that inspired the Taj Mahal",
                "image": "https://images.unsplash.com/photo-1624361899662-3ce9c0f44817?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
            {
                "name": "Lodhi Garden",
                "type": "hidden_gem",
                "description": "Ancient tombs inside a peaceful city garden — free entry",
                "why_special": "Beautiful Mughal tombs inside a park — almost no tourists visit this",
                "image": "https://plus.unsplash.com/premium_photo-1673141390222-2bd01b623bf3?w=800&q=90",
                "tags": ["hidden", "nature"],
            },
        ],
        food=[
            {
                "name": "Haldirams",
                "dish": "Kachori Sabji",
                "where": "Chandni Chowk, Delhi",
                "price_range": "Budget",
                "description": "Best breakfast before the Agra drive",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Yamuna Expressway — only 2.5 hours from Delhi to Agra", "category": "transport"},
            {"text": "Start early — reach Taj Mahal by 6 AM for sunrise and zero crowds", "category": "general"},
        ],
    )

    create_stop_with_content(
        route_id=agra_route.id,
        dest_id=agra.id,
        order=2, day_rec="Day 1", dist_prev=210,
        attractions=[
            {
                "name": "Taj Mahal",
                "type": "attraction",
                "description": "One of the Seven Wonders — most beautiful at sunrise",
                "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=90",
                "tags": ["heritage", "photography", "UNESCO"],
            },
            {
                "name": "Agra Fort",
                "type": "attraction",
                "description": "Massive Mughal fort with views of Taj Mahal from inside",
                "image": "https://images.unsplash.com/photo-1591018653367-9c01498b3320?w=800&q=90",
                "tags": ["heritage"],
            },
            {
                "name": "Fatehpur Sikri",
                "type": "attraction",
                "description": "Abandoned Mughal ghost city — perfectly preserved",
                "image": "https://plus.unsplash.com/premium_photo-1691031429261-aeb324882888?w=800&q=90",
                "tags": ["heritage", "photography"],
            },
            {
                "name": "Mehtab Bagh",
                "type": "hidden_gem",
                "description": "Garden directly across Taj on opposite riverbank",
                "why_special": "Best sunset view of Taj Mahal with almost zero crowds",
                "image": "https://images.unsplash.com/photo-1576135872771-b3205260262f?w=800&q=90",
                "tags": ["hidden", "photography"],
            },
            {
                "name": "Itimad-ud-Daulah",
                "type": "hidden_gem",
                "description": "Baby Taj — smaller but intricate marble inlay work",
                "why_special": "Called Baby Taj but far less crowded — better for detailed photography",
                "image": "https://images.unsplash.com/photo-1612810436541-336b73fbcf9f?w=800&q=90",
                "tags": ["hidden", "heritage"],
            },
        ],
        food=[
            {
                "name": "Deviram Sweets",
                "dish": "Petha and Bedai",
                "where": "Noori Gate, Agra",
                "price_range": "Budget",
                "description": "Famous Agra petha sweet — original shop since 1765",
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=90",
            },
            {
                "name": "Pind Balluchi",
                "dish": "Mughlai Biryani",
                "where": "Fatehabad Road, Agra",
                "price_range": "Mid-range",
                "description": "Best biryani in Agra — near Taj Mahal",
                "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=90",
            },
        ],
        tips=[
            {"text": "Taj Mahal tickets — book online — no ticket at gate on weekends", "category": "safety"},
            {"text": "Visit Taj at 6 AM sunrise — golden light and barely any people", "category": "general"},
            {"text": "Friday is closed at Taj Mahal — plan accordingly", "category": "season"},
            {"text": "No vehicles near Taj — take e-rickshaw from parking to gate", "category": "transport"},
        ],
    )

    create_itinerary_for_route(
        route_id=agra_route.id,
        name="Delhi to Agra Day Trip Itinerary",
        total_days=2,
        days_data=[
            {
                "day_number": 1, "title": "Taj Mahal and Agra Fort",
                "destination_name": "Delhi to Agra",
                "activities": [
                    {"id": 1, "name": "Early drive from Delhi on Yamuna Expressway", "time_slot": "Early Morning", "type": "transport"},
                    {"id": 2, "name": "Taj Mahal sunrise visit", "time_slot": "Morning", "type": "attraction"},
                    {"id": 3, "name": "Agra Fort exploration", "time_slot": "Afternoon", "type": "attraction"},
                    {"id": 4, "name": "Petha and Bedai at Deviram Sweets", "time_slot": "Afternoon", "type": "food"},
                    {"id": 5, "name": "Mehtab Bagh sunset view of Taj", "time_slot": "Evening", "type": "hidden_gem"},
                ],
            },
            {
                "day_number": 2, "title": "Fatehpur Sikri and Return",
                "destination_name": "Agra to Delhi",
                "activities": [
                    {"id": 6, "name": "Itimad-ud-Daulah Baby Taj visit", "time_slot": "Morning", "type": "hidden_gem"},
                    {"id": 7, "name": "Fatehpur Sikri ghost city", "time_slot": "Morning", "type": "attraction"},
                    {"id": 8, "name": "Mughlai Biryani lunch at Pind Balluchi", "time_slot": "Afternoon", "type": "food"},
                    {"id": 9, "name": "Drive back to Delhi", "time_slot": "Afternoon", "type": "transport"},
                ],
            },
        ],
    )


db.close()

print("\n========================================")
print("ALL STOPS SEEDED WITH SHARP IMAGES!")
print("========================================")
print("\nAll images now w=800 q=90 — sharp and clear!")
print("Restart FastAPI server then refresh frontend.")
