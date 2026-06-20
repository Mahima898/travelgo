import { useState } from 'react';
import TabBar from '../TabBar/TabBar';
import Badge from '../Badge/Badge';
import { EmptyState } from '../Feedback/Feedback';
import './RouteStopList.css';

const TABS = [
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'gems',        label: 'Hidden Gems', icon: '💎' },
  { id: 'food',        label: 'Food',        icon: '🍛' },
  { id: 'tips',        label: 'Tips',        icon: '💡' },
];

const TIP_ICONS = {
  transport: '🚗',
  safety:    '⚠️',
  season:    '🌤️',
  general:   '💡',
  food:      '🍴',
  packing:   '🎒',
};


const FALLBACK =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80';

// ── ATTRACTION ITEM WITH IMAGE ──
const AttractionItem = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = (!imgError && item.image) ? item.image : null;

  return (
    <div className="stop-item">
      {/* Show image only if URL exists */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={item.name}
          className="stop-item__image"
          onError={() => setImgError(true)}
        />
      )}

      <div className="stop-item__icon">
        {item.type === 'hidden_gem' ? '💎' : '🏛️'}
      </div>

      <div className="stop-item__body">
        <div className="stop-item__header">
          <h5 className="stop-item__name">{item.name}</h5>
          {item.type && <Badge label={item.type} size="xs" />}
        </div>
        <p className="stop-item__desc">{item.description}</p>
        {item.why_special && (
          <p className="stop-item__gem-note">💡 {item.why_special}</p>
        )}
        {item.tags?.length > 0 && (
          <div className="stop-item__tags">
            {item.tags.map((tag) => (
              <Badge key={tag} label={tag} size="xs" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const FoodItem = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = (!imgError && item.image) ? item.image : null;

  return (
    <div className="food-item">
      {/* Show image only if URL exists */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={item.dish}
          className="food-item__image"
          onError={() => setImgError(true)}
        />
      )}

      <div className="food-item__header">
        <h5 className="food-item__dish">{item.dish || item.name}</h5>
        {item.price_range && (
          <Badge label={item.price_range} color="amber" size="xs" />
        )}
      </div>
      {item.where && (
        <p className="food-item__where">📍 {item.where}</p>
      )}
      {item.description && (
        <p className="food-item__desc">{item.description}</p>
      )}
    </div>
  );
};


const TipItem = ({ item }) => (
  <div className="tip-item">
    <span className="tip-item__icon">
      {TIP_ICONS[item.category] || '💡'}
    </span>
    <p className="tip-item__text">{item.text}</p>
  </div>
);


const StopAccordion = ({ stop, index, isExpanded, onToggle }) => {
  const [activeTab, setActiveTab] = useState('attractions');

  return (
    <div className={`stop-accordion ${isExpanded ? 'stop-accordion--open' : ''}`}>

      <button className="stop-accordion__header" onClick={onToggle}>
        <div className={`stop-accordion__num ${isExpanded ? 'stop-accordion__num--active' : ''}`}>
          {index + 1}
        </div>

        <div className="stop-accordion__info">
          <div className="stop-accordion__name-row">
            <h4 className="stop-accordion__name">
              {stop.destination?.name}
            </h4>
            <span className="stop-accordion__day">
              {stop.day_recommendation}
            </span>
          </div>
          <p className="stop-accordion__region">
            {stop.destination?.region}
            {stop.distance_from_prev > 0 && (
              <span> · {stop.distance_from_prev} km from previous stop</span>
            )}
          </p>
        </div>

        <div className="stop-accordion__counts">
          {stop.attractions?.length > 0 && (
            <span className="stop-accordion__count">
              🏛️ {stop.attractions.length}
            </span>
          )}
          {stop.hidden_gems?.length > 0 && (
            <span className="stop-accordion__count">
              💎 {stop.hidden_gems.length}
            </span>
          )}
          {stop.food?.length > 0 && (
            <span className="stop-accordion__count">
              🍛 {stop.food.length}
            </span>
          )}
        </div>

        <span className={`stop-accordion__chevron ${isExpanded ? 'stop-accordion__chevron--up' : ''}`}>
          ▾
        </span>
      </button>

      {isExpanded && (
        <div className="stop-accordion__body">
          <TabBar
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="stop-accordion__tab-content">

            {activeTab === 'attractions' && (
              stop.attractions?.length > 0
                ? stop.attractions.map((a) => (
                    <AttractionItem key={a.id} item={a} />
                  ))
                : <EmptyState icon="🏛️" title="No attractions listed yet" />
            )}

            {activeTab === 'gems' && (
              stop.hidden_gems?.length > 0
                ? stop.hidden_gems.map((g) => (
                    <AttractionItem
                      key={g.id}
                      item={{ ...g, type: 'hidden_gem' }}
                    />
                  ))
                : <EmptyState icon="💎" title="No hidden gems listed yet" />
            )}

            {activeTab === 'food' && (
              stop.food?.length > 0
                ? stop.food.map((f) => (
                    <FoodItem key={f.id} item={f} />
                  ))
                : <EmptyState icon="🍛" title="No food recommendations yet" />
            )}

            {activeTab === 'tips' && (
              stop.tips?.length > 0
                ? stop.tips.map((t) => (
                    <TipItem key={t.id} item={t} />
                  ))
                : <EmptyState icon="💡" title="No travel tips yet" />
            )}

          </div>
        </div>
      )}
    </div>
  );
};


const RouteStopList = ({ stops = [] }) => {
  const [expandedId, setExpandedId] = useState(stops[0]?.id ?? null);

  if (stops.length === 0) {
    return (
      <EmptyState
        icon="📍"
        title="No stops added yet"
        subtitle="Route stops will appear here once added by admin."
      />
    );
  }

  return (
    <div className="route-stop-list">
      {stops.map((stop, index) => (
        <StopAccordion
          key={stop.id}
          stop={stop}
          index={index}
          isExpanded={expandedId === stop.id}
          onToggle={() =>
            setExpandedId(expandedId === stop.id ? null : stop.id)
          }
        />
      ))}
    </div>
  );
};

export default RouteStopList;