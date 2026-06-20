import Badge from '../Badge/Badge';
import {
  formatDuration,
  formatStopCount,
  formatBudgetRange,
} from '../../utils/utils';
import './RouteSummaryBanner.css';

const RouteSummaryBanner = ({ route, onPlanTrip }) => {
  return (
    <div className="route-banner">
      {/* Decorative background shapes */}
      <div className="route-banner__circle route-banner__circle--1" />
      <div className="route-banner__circle route-banner__circle--2" />

      <div className="route-banner__content">
        {/* Transport type badge */}
        <div className="route-banner__badge">
          <Badge label={`${route.transport_type} Journey`} color="green" size="sm" />
        </div>

        {/* Route path headline */}
        <h1 className="route-banner__title">
          {route.source}
          <span className="route-banner__arrow"> → </span>
          {route.destination}
        </h1>

        {/* Route description */}
        {route.description && (
          <p className="route-banner__desc">{route.description}</p>
        )}

        {/* Meta stats row */}
        <div className="route-banner__meta">
          {[
            { icon: '📍', label: formatStopCount(route.stop_count) },
            { icon: '🗓️', label: formatDuration(route.duration_min, route.duration_max) },
            { icon: '💰', label: formatBudgetRange(route.budget_min, route.budget_max) },
            { icon: '📏', label: `${route.distance_km} km` },
          ].map(({ icon, label }) => (
            <div key={label} className="route-banner__meta-item">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="route-banner__tags">
          {route.tags?.map((tag) => (
            <span key={tag} className="route-banner__tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Plan trip CTA */}
        {onPlanTrip && (
          <div className="route-banner__actions">
            <button className="route-banner__plan-btn" onClick={onPlanTrip}>
              🗺️ Plan This Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteSummaryBanner;