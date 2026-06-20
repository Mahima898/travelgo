import { useNavigate } from 'react-router-dom';
import Badge from '../Badge/Badge';
import { formatBudgetRange, formatDuration, formatStopCount } from '../../utils/utils';
import './RouteCard.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';

const RouteCard = ({ route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/routes/${route.id}`);
  };

  return (
    <div className="route-card" onClick={handleClick}>

      {/* ── COVER IMAGE ── */}
      <div className="route-card__image-wrap">
        <img
          src={route.cover_image || FALLBACK_IMAGE}
          alt={route.name}
          className="route-card__image"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        {/* Dark gradient overlay */}
        <div className="route-card__overlay" />

        {/* Transport badge top right */}
        <div className="route-card__transport">
          <Badge label={route.transport_type} color="green" size="xs" />
        </div>

        {/* Route path on image */}
        <p className="route-card__path">
          {route.source} → {route.destination}
        </p>
      </div>

      {/* ── CARD BODY ── */}
      <div className="route-card__body">

        {/* Title */}
        <h3 className="route-card__title">{route.name}</h3>

        {/* Description */}
        <p className="route-card__desc">
          {route.description?.slice(0, 95)}...
        </p>

        {/* Meta row */}
        <div className="route-card__meta">
          <span className="route-card__meta-item">
            🗓️ {formatDuration(route.duration_min, route.duration_max)}
          </span>
          <span className="route-card__meta-item">
            📍 {formatStopCount(route.stop_count)}
          </span>
          <span className="route-card__meta-item">
            💰 {formatBudgetRange(route.budget_min, route.budget_max)}
          </span>
        </div>

        {/* Tags */}
        <div className="route-card__tags">
          {route.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} label={tag} size="xs" />
          ))}
        </div>

        {/* CTA */}
        <button className="route-card__btn">
          Explore Route →
        </button>
      </div>
    </div>
  );
};

export default RouteCard;