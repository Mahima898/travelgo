import './JourneyHighlights.css';

const HIGHLIGHT_CONFIG = [
  { key: 'best_food',         icon: '🍛', label: 'Best Food Stop',     colorClass: 'highlight--amber'  },
  { key: 'best_photo',        icon: '📸', label: 'Best Photo Spot',    colorClass: 'highlight--purple' },
  { key: 'best_gem',          icon: '💎', label: 'Hidden Gem',         colorClass: 'highlight--green'  },
  { key: 'best_family',       icon: '👨‍👩‍👧', label: 'Best for Families', colorClass: 'highlight--blue'   },
  { key: 'most_underrated',   icon: '🌟', label: 'Most Underrated',    colorClass: 'highlight--red'    },
];

const JourneyHighlights = ({ highlights }) => {
  if (!highlights) return null;

  return (
    <div className="journey-highlights">
      {/* Section heading */}
      <div className="journey-highlights__header">
        <h3 className="journey-highlights__title">Journey Highlights</h3>
        <span className="journey-highlights__badge">CURATED</span>
      </div>

      {/* Highlight cards grid */}
      <div className="journey-highlights__grid">
        {HIGHLIGHT_CONFIG.map(({ key, icon, label, colorClass }) => {
          const value = highlights[key];
          if (!value) return null;

          return (
            <div
              key={key}
              className={`highlight-card ${colorClass}`}
            >
              <div className="highlight-card__icon-wrap">
                <span className="highlight-card__icon">{icon}</span>
                <span className="highlight-card__label">{label}</span>
              </div>
              <p className="highlight-card__value">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyHighlights;