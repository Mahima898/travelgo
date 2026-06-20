import './StatCard.css';

const StatCard = ({
  icon,
  value,
  label,
  color = '#1a6b4a',
  compact = false,
}) => (
  <div className={`stat-card ${compact ? 'stat-card--compact' : ''}`}>
    <div
      className="stat-card__icon"
      style={{ background: `${color}18` }}
    >
      {icon}
    </div>
    <div className="stat-card__content">
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  </div>
);

export default StatCard;