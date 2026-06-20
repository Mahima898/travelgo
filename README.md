# TravelGo — Full Stack Travel Discovery Platform

> Don't just reach the destination. Explore the entire journey.

TravelGo is a full-stack travel discovery platform that helps users explore **hidden gems, local food, photography spots, and day-wise itineraries** at every stop between source and destination — not just the endpoint.


## Live Demo

> Frontend: `http://localhost:5173` &nbsp;|&nbsp; Backend API: `http://localhost:8000/docs`

## Tech Stack

### Frontend
| Technology | Usage |
|------------|-------|
| React.js + Vite | UI Framework |
| React Router v6 | Client-side Navigation |
| Context API | Global State Management |
| Axios | HTTP Client + Interceptors |
| Pure CSS | Styling (no UI libraries) |

### Backend
| Technology | Usage |
|------------|-------|
| FastAPI (Python) | REST API Framework |
| PostgreSQL | Relational Database |
| SQLAlchemy ORM | Database Interaction |
| Pydantic v2 | Request/Response Validation |
| JWT + bcrypt | Authentication & Security |


## Features

-  **Autocomplete Search** — Debounced search with keyboard navigation
-  **Route Explorer** — Explore stops, attractions, hidden gems along any route
-  **Hidden Gems** — Offbeat places most tourists never find
-  **Local Food Guide** — Best dishes and restaurants at every stop
-  **Trip Planner** — Customize day-wise itinerary and save your trip
-  **JWT Authentication** — Secure login, register, and session management
-  **Role-based Access** — User and Admin roles with protected routes
-  **Admin Panel** — Full CRUD for 7 entities across 10 database tables
-  **Budget Guidance** — Realistic cost estimates for every route
-  **Photography Spots** — Best viewpoints curated for every journey

##  Project Structure

```
travelgo/
├── travel-go-frontend/          # React.js Frontend
│   └── src/
│       ├── components/          # 20+ Reusable Components
│       ├── pages/               # 10 Complete Pages
│       ├── context/             # Auth, Trip, Toast Context
│       ├── services/            # API Service Layer
│       ├── hooks/               # 7 Custom Hooks
│       └── utils/               # Helper Functions
│
└── travel-go-backend/           # FastAPI Backend
    ├── app/
    │   ├── api/routes/          # All API Endpoints
    │   ├── models/              # SQLAlchemy Models
    │   ├── schemas/             # Pydantic Schemas
    │   ├── crud/                # Database Operations
    │   └── core/                # Auth, Config, Security
    ├── main.py
    ├── seed_data.py
    └── requirements.txt
```

##  Database Schema

10 PostgreSQL tables:

```
users → routes → stops → attractions
                       → food_items
                       → tips
     → itineraries → itinerary_days
     → trips
     → destinations
```

##  API Endpoints (30+)

```
Auth          POST /auth/register, /auth/login, GET /auth/me
Routes        GET  /routes, /routes/popular, /routes/search
              GET  /routes/{id}, /routes/{id}/stops
Destinations  GET  /destinations, /destinations/{id}
Itineraries   GET  /itineraries/route/{route_id}
Trips         GET/POST/PUT/DELETE /trips, /trips/{id}
Users         GET/PUT /users/me, PUT /users/me/password
Admin         GET  /admin/stats
              CRUD /admin/routes|destinations|attractions
              CRUD /admin/food|tips|itineraries
              GET  /admin/users
```

##  Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Backend Setup

```bash
cd travel-go-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
# Create .env file with:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/travelgo_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
APP_NAME=TravelGo

# Create database
psql -U postgres
CREATE DATABASE travelgo_db;
\q

# Run server
uvicorn main:app --reload --port 8000
```

---

### Frontend Setup

```bash
cd travel-go-frontend

# Install dependencies
npm install

# Create .env file with:
VITE_API_BASE_URL=http://localhost:8000

# Run development server
npm run dev
```
### Seed Database

```bash
cd travel-go-backend
python seed_data.py    # Add routes and destinations
python seed_stops.py   # Add stops with images
```

### Create Admin User

```bash
python create_admin.py


##  Pages

| Page | Description 
| Home | Hero, features, popular routes, reviews |
| Explore Routes | Search, filter by tags, sort results |
| Route Explorer | Stops, attractions, hidden gems, food, tips |
| Trip Planner | Customize itinerary, save trip |
| My Trips | View and manage saved trips |
| Profile | Edit profile, change password |
| Admin Dashboard | Stats, quick actions, activity feed |
| Admin CRUD Pages | Manage all 7 entities |


##  Authentication Flow

```
Register → Hash password (bcrypt) → Store in DB
Login    → Verify password → Generate JWT token
Request  → Axios interceptor → Attach Bearer token
Backend  → Decode JWT → Get current user → Process request
```


## React Concepts Used

- React Router v6 (nested routes, protected routes, Outlet)
- useState + useEffect (forms, API calls, side effects)
- Context API (AuthContext, TripContext, ToastContext)
- Array Methods (map, filter, find, sort, reduce)
- Component Architecture (40+ reusable components)
- Form Handling (controlled inputs, validation)
- Conditional Rendering (loading, error, empty states)
- localStorage (session persistence)
- Axios interceptors (JWT auto-attach, 401 handling)


## FastAPI Concepts Used

- FastAPI Setup and Structure (APIRouter, Swagger)
- REST Routing (GET, POST, PUT, DELETE)
- Path Parameters (/routes/{id}, /trips/{id})
- Query Parameters (?from=Delhi&to=Kashmir)
- Pydantic Models (validation, response shaping)
- SQLAlchemy ORM (models, relationships, cascade)
- PostgreSQL Integration (10 tables, optimized queries)
- CRUD Operations (create, read, update, delete)
- Error Handling (400, 401, 403, 404 HTTPException)
- JWT Authentication (token, role-based access control)

---

## Author

**Mahima**
- GitHub: [@Mahima898](https://github.com/Mahima898)

---

##  License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with  using React.js + FastAPI
</div>