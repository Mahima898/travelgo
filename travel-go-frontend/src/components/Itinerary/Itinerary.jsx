import { useContext } from 'react';
import { TripContext } from '../../context/AppContext';
import './Itinerary.css';


const ACTIVITY_ICONS = {
  transport:  '🚗',
  attraction: '🏛️',
  food:       '🍛',
  hidden_gem: '💎',
  spiritual:  '🙏',
  general:    '📋',
};


const ACTIVITY_COLORS = {
  transport:  'activity--blue',
  attraction: 'activity--green',
  food:       'activity--amber',
  hidden_gem: 'activity--purple',
  spiritual:  'activity--pink',
  general:    'activity--gray',
};


const ActivityItem = ({ activity, dayIndex, interactive }) => {
  const { toggleActivity } = useContext(TripContext);
  const isIncluded = activity.included !== false;
  const icon = ACTIVITY_ICONS[activity.type] || '📌';
  const colorClass = ACTIVITY_COLORS[activity.type] || 'activity--gray';

  return (
    <div className={`activity ${!isIncluded && interactive ? 'activity--excluded' : ''}`}>
      {/* Checkbox for interactive mode */}
      {interactive && (
        <input
          type="checkbox"
          checked={isIncluded}
          onChange={() => toggleActivity(dayIndex, activity.id)}
          className="activity__checkbox"
        />
      )}

      {/* Icon */}
      <div className={`activity__icon ${colorClass}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="activity__body">
        <div className="activity__name-row">
          <span className="activity__name">{activity.name}</span>
          {activity.time_slot && (
            <span className="activity__time">{activity.time_slot}</span>
          )}
        </div>
        {activity.description && (
          <p className="activity__desc">{activity.description}</p>
        )}
      </div>
    </div>
  );
};


const DayCard = ({ day, dayIndex, interactive }) => {
  const { updateDayNote } = useContext(TripContext);

  const includedCount = day.activities?.filter(
    (a) => a.included !== false
  ).length || 0;
  const totalCount = day.activities?.length || 0;

  return (
    <div className="day-card">
      {/* Day header */}
      <div className="day-card__header">
        <div className="day-card__header-left">
          <span className="day-card__day-label">
            Day {day.day_number}
          </span>
          <h3 className="day-card__title">{day.title}</h3>
          {day.destination_name && (
            <p className="day-card__destination">
              📍 {day.destination_name}
            </p>
          )}
        </div>

        {/* Activity count badge — only in interactive mode */}
        {interactive && (
          <div className="day-card__count">
            <span className="day-card__count-num">{includedCount}</span>
            <span className="day-card__count-total">/{totalCount}</span>
            <span className="day-card__count-label">selected</span>
          </div>
        )}
      </div>

      {/* Activities list */}
      <div className="day-card__activities">
        {day.activities?.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            dayIndex={dayIndex}
            interactive={interactive}
          />
        ))}
      </div>

      {/* Personal note — only in interactive mode */}
      {interactive && (
        <div className="day-card__note">
          <label className="day-card__note-label">
            📝 Personal Note for Day {day.day_number}
          </label>
          <textarea
            className="day-card__note-input"
            value={day.note || ''}
            onChange={(e) => updateDayNote(dayIndex, e.target.value)}
            placeholder="Add your own notes for this day..."
          />
        </div>
      )}
    </div>
  );
};


const Itinerary = ({ itinerary, interactive = false }) => {
  if (!itinerary || !itinerary.days?.length) {
    return (
      <div className="itinerary-empty">
        <p className="itinerary-empty__icon">📅</p>
        <p className="itinerary-empty__text">
          No itinerary available for this route yet.
        </p>
      </div>
    );
  }

  return (
    <div className="itinerary">
      {/* Read-only hint */}
      {!interactive && (
        <div className="itinerary__hint">
          <span>ℹ️</span>
          <span>
            This is the default itinerary. Log in and click
            "Plan This Trip" to customize it for your dates.
          </span>
        </div>
      )}

      {/* Day cards */}
      {itinerary.days.map((day, index) => (
        <DayCard
          key={day.id || index}
          day={day}
          dayIndex={index}
          interactive={interactive}
        />
      ))}
    </div>
  );
};

export default Itinerary;