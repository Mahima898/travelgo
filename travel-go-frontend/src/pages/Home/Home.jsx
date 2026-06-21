import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import SearchBar from '../../components/SearchBar/SearchBar';
import RouteCard from '../../components/RouteCard/RouteCard';
import TagFilterBar from '../../components/TagFilterBar/TagFilterBar';
import { SectionHeading } from '../../components/PageHeader/PageHeader';
import Loader from '../../components/Loader/Loader';
import { routeService } from '../../services/services';
import { MOCK_ROUTES } from '../../data/mockData';
import './Home.css';


const FEATURES = [
  {
    icon: '🗺️',
    title: 'Explore the Journey',
    desc: 'Discover what lies between your start and destination — not just the endpoint.',
  },
  {
    icon: '💎',
    title: 'Hidden Gems',
    desc: 'Uncover places most tourists never find. Local secrets and offbeat wonders.',
  },
  {
    icon: '📅',
    title: 'Day-wise Itineraries',
    desc: 'Ready-made plans you can customize. Know exactly what to do each day.',
  },
  {
    icon: '🍛',
    title: 'Local Food Guide',
    desc: "Don't miss regional specialties. Know what to eat and exactly where.",
  },
  {
    icon: '📸',
    title: 'Photography Spots',
    desc: "Capture the perfect frame. Every route's best viewpoints curated for you.",
  },
  {
    icon: '💰',
    title: 'Budget Guidance',
    desc: 'Realistic cost estimates so you can plan your dream trip without surprises.',
  },
];


const QUICK_ROUTES = [
  { from: 'Delhi', to: 'Kashmir' },
  { from: 'Delhi', to: 'Manali' },
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Delhi', to: 'Rishikesh' },
];


const REVIEWS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: '👩',
    rating: 5,
    route: 'Delhi to Kashmir',
    review:
      'TravelGo made my Kashmir trip absolutely magical. The hidden gems section showed me Surinsar Lake which no other app mentioned. Totally worth it!',
    date: 'March 2024',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Bangalore',
    avatar: '👨',
    rating: 5,
    route: 'Delhi to Manali',
    review:
      'The day-wise itinerary was a lifesaver. I found Naggar Castle through TravelGo — most tourists skip it but the views are better than Manali itself!',
    date: 'February 2024',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Pune',
    avatar: '👩',
    rating: 5,
    route: 'Delhi to Jaipur',
    review:
      'Mehtab Bagh was a gem I discovered here. Best sunset view of Taj Mahal with zero crowds. My travel photos have never been better!',
    date: 'January 2024',
  },
  {
    id: 4,
    name: 'Arjun Singh',
    location: 'Delhi',
    avatar: '🧑',
    rating: 5,
    route: 'Delhi to Rishikesh',
    review:
      'The food recommendations were spot on. Chotiwala in Haridwar and the Beatles Ashram tip were highlights of my trip. Planning my next one already!',
    date: 'April 2024',
  },
  {
    id: 5,
    name: 'Sneha Gupta',
    location: 'Hyderabad',
    avatar: '👩',
    rating: 5,
    route: 'Delhi to Kashmir',
    review:
      'Loved the trip planner feature. I customized my itinerary and saved it — everything was organized. Dal Lake at sunrise was exactly as described!',
    date: 'May 2024',
  },
  {
    id: 6,
    name: 'Karan Mehta',
    location: 'Jaipur',
    avatar: '👨',
    rating: 5,
    route: 'Delhi to Manali',
    review:
      'The budget breakdown was very accurate. No surprises on the trip. Rohtang Pass permit tip saved us from wasting an entire day. Highly recommend!',
    date: 'June 2024',
  },
];


const StarRating = ({ rating }) => (
  <div className="star-rating">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`star-rating__star ${i < rating ? 'star-rating__star--filled' : ''}`}
      >
        ★
      </span>
    ))}
  </div>
);


const ReviewCard = ({ review }) => (
  <div className="review-card">
    {/* Quote icon */}
    <div className="review-card__quote">"</div>

    {/* Stars */}
    <StarRating rating={review.rating} />

    {/* Review text */}
    <p className="review-card__text">{review.review}</p>

    {/* Route tag */}
    <div className="review-card__route">
      🗺️ {review.route}
    </div>

    {/* User info */}
    <div className="review-card__user">
      <div className="review-card__avatar">{review.avatar}</div>
      <div className="review-card__user-info">
        <p className="review-card__name">{review.name}</p>
        <p className="review-card__location">
          📍 {review.location} · {review.date}
        </p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [routes, setRoutes]               = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedTags, setSelectedTags]   = useState([]);
  const [loading, setLoading]             = useState(true);

  
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const res = await routeService.getPopular(6);
        setRoutes(res.data);
        setFilteredRoutes(res.data);
      } catch (err) {
        console.error('Failed to load routes:', err);
        setRoutes(MOCK_ROUTES);
        setFilteredRoutes(MOCK_ROUTES);
      } finally {
        setLoading(false);
      }
    };
    loadRoutes();
  }, []);

  // Filter by tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredRoutes(routes);
    } else {
      setFilteredRoutes(
        routes.filter((route) =>
          selectedTags.some((tag) => route.tags?.includes(tag))
        )
      );
    }
  }, [selectedTags, routes]);

  return (
    <div className="home">
      <Navbar />

      {/*  HERO SECTION */}
      <section className="hero">
        <div className="hero__circle hero__circle--1" />
        <div className="hero__circle hero__circle--2" />
        <div className="hero__circle hero__circle--3" />

        <div className="hero__content">
          <div className="hero__pill">
            <span>✨</span>
            <span>India's Travel Discovery Platform</span>
          </div>

          <h1 className="hero__title">
            Don't just reach the
            <span className="hero__title-highlight"> destination.</span>
            <br />
            Explore the journey.
          </h1>

          <p className="hero__subtitle">
            Discover hidden gems, local food, photography spots and
            must-visit attractions at every stop — not just at the end.
          </p>

          <div className="hero__search">
            <SearchBar large />
          </div>

          <div className="hero__quick">
            <span className="hero__quick-label">Popular:</span>
            <div className="hero__quick-routes">
              {QUICK_ROUTES.map(({ from, to }) => (
                <button
                  key={`${from}-${to}`}
                  className="hero__quick-pill"
                  onClick={() =>
                    navigate(`/search?from=${from}&to=${to}`)
                  }
                >
                  {from} → {to}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero__scroll">
          <span className="hero__scroll-text">Scroll to explore</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="features__container">
          <SectionHeading
            eyebrow="Why TravelGo"
            title="Experience travel differently"
            subtitle="Most apps tell you where to go. We tell you everything you'll discover along the way."
            centered
          />
          <div className="features__grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES SECTION */}
      <section className="popular">
        <div className="popular__container">
          <SectionHeading
            eyebrow="Popular Routes"
            title="Start with a curated journey"
            subtitle="Hand-picked routes with detailed stops, hidden gems, and local insights"
          />

          <div className="popular__filters">
            <TagFilterBar
              selectedTags={selectedTags}
              onFilterChange={setSelectedTags}
            />
          </div>

          {loading ? (
            <Loader variant="card" count={4} />
          ) : filteredRoutes.length === 0 ? (
            <div className="popular__empty">
              <p className="popular__empty-icon">🗺️</p>
              <p className="popular__empty-text">
                No routes match these filters.
              </p>
              <button
                className="popular__empty-btn"
                onClick={() => setSelectedTags([])}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="popular__grid">
              {filteredRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS SECTION (replaces old CTA) */}
      <section className="reviews-section">
        <div className="reviews-section__container">
          <SectionHeading
            eyebrow="Traveler Stories"
            title="Real experiences, real journeys"
            subtitle="See what fellow travelers discovered using TravelGo"
            centered
          />

          {/* Stats row */}
          <div className="reviews-stats">
            <div className="reviews-stats__item">
              <p className="reviews-stats__number">10,000+</p>
              <p className="reviews-stats__label">Happy Travelers</p>
            </div>
            <div className="reviews-stats__divider" />
            <div className="reviews-stats__item">
              <p className="reviews-stats__number">4.9 ★</p>
              <p className="reviews-stats__label">Average Rating</p>
            </div>
            <div className="reviews-stats__divider" />
            <div className="reviews-stats__item">
              <p className="reviews-stats__number">50+</p>
              <p className="reviews-stats__label">Routes Covered</p>
            </div>
            <div className="reviews-stats__divider" />
            <div className="reviews-stats__item">
              <p className="reviews-stats__number">200+</p>
              <p className="reviews-stats__label">Hidden Gems Found</p>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="reviews-grid">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;