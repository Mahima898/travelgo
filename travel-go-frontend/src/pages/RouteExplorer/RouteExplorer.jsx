import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RouteSummaryBanner from '../../components/RouteSummaryBanner/RouteSummaryBanner';
import RouteStopList from '../../components/RouteStopList/RouteStopList';
import JourneyHighlights from '../../components/JourneyHighlights/JourneyHighlights';
import DontMissBanner from '../../components/DontMissBanner/DontMissBanner';
import Loader from '../../components/Loader/Loader';
import { ErrorMessage } from '../../components/Feedback/Feedback';
import { Breadcrumb, SectionHeading } from '../../components/PageHeader/PageHeader';
import { AuthContext, ToastContext } from '../../context/AppContext';
import { routeService, stopService } from '../../services/services';
import { formatBudget } from '../../utils/utils';
import './RouteExplorer.css';

// Budget breakdown card
const BudgetCard = ({ route }) => {
  const breakdown = [
    { label: 'Transport (per person)', min: route.budget_min * 0.35, max: route.budget_max * 0.35 },
    { label: 'Accommodation (total)', min: route.budget_min * 0.4,  max: route.budget_max * 0.4 },
    { label: 'Food & Dining',         min: route.budget_min * 0.15, max: route.budget_max * 0.15 },
    { label: 'Sightseeing & Misc',    min: route.budget_min * 0.1,  max: route.budget_max * 0.1 },
  ];

  return (
    <div className="budget-card">
      <h3 className="budget-card__title">💰 Estimated Budget</h3>
      <div className="budget-card__rows">
        {breakdown.map(({ label, min, max }) => (
          <div key={label} className="budget-card__row">
            <span className="budget-card__label">{label}</span>
            <span className="budget-card__amount">
              {formatBudget(Math.round(min))} – {formatBudget(Math.round(max))}
            </span>
          </div>
        ))}
      </div>
      <div className="budget-card__total">
        <span className="budget-card__total-label">Total Estimated</span>
        <span className="budget-card__total-amount">
          {formatBudget(route.budget_min)} – {formatBudget(route.budget_max)}
        </span>
      </div>
      <p className="budget-card__note">* Per person estimate. Prices vary by season.</p>
    </div>
  );
};

// Route info card
const RouteInfoCard = ({ route }) => (
  <div className="route-info-card">
    <h4 className="route-info-card__title">Route Info</h4>
    {[
      { label: 'Distance',     value: `${route.distance_km} km` },
      { label: 'Duration',     value: `${route.duration_min}–${route.duration_max} Days` },
      { label: 'Mode',         value: route.transport_type },
      { label: 'Total Stops',  value: route.stop_count },
    ].map(({ label, value }) => (
      <div key={label} className="route-info-card__row">
        <span className="route-info-card__label">{label}</span>
        <span className="route-info-card__value">{value}</span>
      </div>
    ))}
  </div>
);

// Plan CTA card
const PlanCtaCard = ({ onPlanTrip }) => (
  <div className="plan-cta-card">
    <p className="plan-cta-card__title">Ready to plan?</p>
    <p className="plan-cta-card__desc">
      Customize this itinerary and save your personalized trip plan.
    </p>
    <button className="plan-cta-card__btn" onClick={onPlanTrip}>
      🗺️ Plan This Trip
    </button>
  </div>
);


// ROUTE EXPLORER PAGE
const RouteExplorer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [route, setRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── REAL API CALLS ──
  // GET /routes/{id}
  // GET /routes/{id}/stops
  useEffect(() => {
    const loadRoute = async () => {
      try {
        setLoading(true);
        setError(null);

        // Run both calls at same time for speed
        const [routeRes, stopsRes] = await Promise.all([
          routeService.getById(id),
          stopService.getByRouteId(id),
        ]);

        setRoute(routeRes.data);
        setStops(stopsRes.data);

      } catch (err) {
        setError(
          err.response?.data?.detail ||
          'Route not found. It may have been removed or the link is incorrect.'
        );
      } finally {
        setLoading(false);
      }
    };
    loadRoute();
  }, [id]);

  const handlePlanTrip = () => {
    if (!isAuthenticated) {
      showToast('Please log in to plan and save a trip', 'info');
      navigate('/login');
      return;
    }
    navigate(`/plan/${id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="route-explorer">
        <Navbar />
        <div className="route-explorer__loading">
          <Loader variant="banner" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="route-explorer">
        <Navbar />
        <div className="route-explorer__error">
          <ErrorMessage
            message={error}
            onRetry={() => navigate('/search')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="route-explorer">
      <Navbar />

      <div className="route-explorer__content">

        <Breadcrumb
          crumbs={[
            { label: 'Home', path: '/' },
            { label: 'Routes', path: '/search' },
            { label: route.name },
          ]}
        />

        {/* Route Banner */}
        <RouteSummaryBanner route={route} onPlanTrip={handlePlanTrip} />

        {/* Journey Highlights */}
        {route.highlights && Object.keys(route.highlights).length > 0 && (
          <div className="route-explorer__section-card">
            <JourneyHighlights highlights={route.highlights} />
          </div>
        )}

        {/* Don't Miss */}
        {route.dont_miss?.length > 0 && (
          <DontMissBanner items={route.dont_miss} />
        )}

        {/* Main grid */}
        <div className="route-explorer__grid">

          {/* Stops list */}
          <div className="route-explorer__stops">
            <SectionHeading
              title={`${stops.length} Stops Along the Route`}
              subtitle="Click each stop to explore attractions, hidden gems, food and travel tips"
            />
            <RouteStopList stops={stops} />
          </div>

          {/* Sidebar */}
          <div className="route-explorer__sidebar">
            <PlanCtaCard onPlanTrip={handlePlanTrip} />
            <BudgetCard route={route} />
            <RouteInfoCard route={route} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RouteExplorer;