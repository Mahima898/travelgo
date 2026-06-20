import './Badge.css';

const TAG_COLOR_MAP = {
  family: 'blue',
  adventure: 'orange',
  food: 'amber',
  photography: 'purple',
  'hidden gems': 'green',
  nature: 'teal',
  budget: 'gray',
  spiritual: 'pink',
  road_trip: 'green',
  scenic: 'teal',
  attraction: 'blue',
  hidden_gem: 'green',
  transport: 'gray',
  admin: 'purple',
  user: 'blue',
  published: 'green',
  draft: 'gray',
  safety: 'red',
  season: 'teal',
  general: 'gray',
};

const Badge = ({ label, color, size = 'sm' }) => {
  
  const resolvedColor =
    color || TAG_COLOR_MAP[label?.toLowerCase()] || 'gray';

  return (
    <span
      className={[
        'badge',
        `badge--${resolvedColor}`,
        `badge--${size}`,
      ].join(' ')}
    >
      {label}
    </span>
  );
};

export default Badge;