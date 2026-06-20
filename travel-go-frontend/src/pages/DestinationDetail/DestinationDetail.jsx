import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RouteCard from '../../components/RouteCard/RouteCard';
import Badge from '../../components/Badge/Badge';
import Loader from '../../components/Loader/Loader';
import { Breadcrumb, SectionHeading } from '../../components/PageHeader/PageHeader';
import { destinationService, routeService } from '../../services/services';
import './DestinationDetail.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [relatedRoutes, setRelatedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestination = async () => {
      try {
        
        const res = await destinationService.getById(id);
        setDestination(res.data);

        
        const routesRes = await routeService.getAll();
        const related = routesRes.data.filter(
          (r) =>
            r.source === res.data.name ||
            r.destination === res.data.name
        );
        setRelatedRoutes(related);

      } catch (err) {
        console.error('Failed to load destination:', err);
        setDestination(null);
      } finally {
        setLoading(false);
      }
    };
    loadDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="dest-detail">
        <Navbar />
        <div className="dest-detail__loading">
          <Loader variant="banner" />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="dest-detail">
        <Navbar />
        <div className="dest-detail__not-found">
          <div className="dest-detail__not-found-icon">📍</div>
          <h2 className="dest-detail__not-found-title">Destination not found</h2>
          <p className="dest-detail__not-found-sub">
            This destination may have been removed or the link is incorrect.
          </p>
          <button
            className="dest-detail__not-found-btn"
            onClick={() => navigate('/search')}
          >
            Browse All Routes
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dest-detail">
      <Navbar />

      {/* Hero image */}
      <div className="dest-detail__hero">
        <img
          src={destination.cover_image}
          alt={destination.name}
          className="dest-detail__hero-img"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200';
          }}
        />
        <div className="dest-detail__hero-overlay" />
        <div className="dest-detail__hero-content">
          <div className="dest-detail__hero-inner">
            <Breadcrumb
              crumbs={[
                { label: 'Home', path: '/' },
                { label: 'Destinations' },
                { label: destination.name },
              ]}
            />
            <h1 className="dest-detail__hero-title">{destination.name}</h1>
            <p className="dest-detail__hero-region">📍 {destination.region}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dest-detail__content">
        <div className="dest-detail__grid">

          {/* Left */}
          <div className="dest-detail__left">
            <div className="dest-detail__section-card">
              <h2 className="dest-detail__section-title">
                About {destination.name}
              </h2>
              <p className="dest-detail__description">
                {destination.description}
              </p>
            </div>

            {relatedRoutes.length > 0 && (
              <div>
                <SectionHeading
                  title={`Routes through ${destination.name}`}
                  subtitle="Explore the full journey to and from this destination"
                />
                <div className="dest-detail__routes-grid">
                  {relatedRoutes.map((route) => (
                    <RouteCard key={route.id} route={route} />
                  ))}
                </div>
              </div>
            )}

            {relatedRoutes.length === 0 && (
              <div className="dest-detail__no-routes">
                <p className="dest-detail__no-routes-icon">🗺️</p>
                <p className="dest-detail__no-routes-text">
                  No routes through {destination.name} yet. Check back soon!
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="dest-detail__sidebar">
            <div className="dest-detail__info-card">
              <h3 className="dest-detail__info-title">Quick Info</h3>

              <div className="dest-detail__info-row">
                <span className="dest-detail__info-label">Best Season</span>
                <span className="dest-detail__info-value">
                  🌤️ {destination.best_season}
                </span>
              </div>

              <div className="dest-detail__info-row">
                <span className="dest-detail__info-label">Region</span>
                <span className="dest-detail__info-value">
                  {destination.region}
                </span>
              </div>

              <div className="dest-detail__info-row">
                <span className="dest-detail__info-label">Routes</span>
                <span className="dest-detail__info-value">
                  {relatedRoutes.length} route{relatedRoutes.length !== 1 ? 's' : ''}
                </span>
              </div>

              {destination.tags?.length > 0 && (
                <div className="dest-detail__tags">
                  <p className="dest-detail__tags-label">Tags</p>
                  <div className="dest-detail__tags-list">
                    {destination.tags.map((tag) => (
                      <Badge key={tag} label={tag} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="dest-detail__cta-card">
              <p className="dest-detail__cta-title">Ready to explore?</p>
              <p className="dest-detail__cta-desc">
                Search routes that pass through {destination.name}.
              </p>
              <button
                className="dest-detail__cta-btn"
                onClick={() => navigate(`/search?to=${destination.name}`)}
              >
                🔍 Find Routes Here
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;