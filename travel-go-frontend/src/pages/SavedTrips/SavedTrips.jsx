import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import Loader from '../../components/Loader/Loader';
import { EmptyState } from '../../components/Feedback/Feedback';
import { ConfirmModal } from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { ToastContext } from '../../context/AppContext';
import { tripService } from '../../services/services';
import { formatDate, formatDateRange, addDays } from '../../utils/utils';
import './SavedTrips.css';

// Status badge
const StatusBadge = ({ status }) => {
  const config = {
    planned:   { bg: '#dbeafe', color: '#2563eb', label: 'Planned' },
    ongoing:   { bg: '#dcfce7', color: '#16a34a', label: 'Ongoing' },
    completed: { bg: '#f1f5f9', color: '#64748b', label: 'Completed' },
  };
  const { bg, color, label } = config[status] || config.planned;
  return (
    <span className="status-badge" style={{ background: bg, color }}>
      {label}
    </span>
  );
};

// Trip card
const TripCard = ({ trip, onView, onDelete }) => {
  const endDate = trip.start_date
    ? addDays(trip.start_date, (trip.days_count || 1) - 1)
    : null;

  return (
    <div className="trip-card">
      <div className="trip-card__header">
        <div className="trip-card__header-left">
          <h3 className="trip-card__name">{trip.name}</h3>
          <p className="trip-card__route">
            {trip.route_source} → {trip.route_destination}
          </p>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <div className="trip-card__meta">
        <span className="trip-card__meta-item">
          📅{' '}
          {trip.start_date
            ? formatDateRange(trip.start_date, endDate)
            : 'No date set'}
        </span>
        <span className="trip-card__meta-item">
          🗓️ {trip.days_count} Days
        </span>
        <span className="trip-card__meta-item">
          ✅ {trip.total_activities} Activities
        </span>
        <span className="trip-card__meta-item">
          🕐 Saved {formatDate(trip.created_at)}
        </span>
      </div>

      <div className="trip-card__actions">
        <Button size="sm" onClick={() => onView(trip)}>
          View Details
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(trip)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

// Trip detail view
const TripDetail = ({ trip, onBack, onDelete }) => {
  const navigate = useNavigate();

  const endDate = trip.start_date
    ? addDays(trip.start_date, (trip.days_count || 1) - 1)
    : null;

  const stats = [
    { icon: '📅', label: 'Start Date',  value: formatDate(trip.start_date) || 'Not set' },
    { icon: '🗓️', label: 'Duration',    value: `${trip.days_count} Days` },
    { icon: '✅', label: 'Activities',  value: `${trip.total_activities} planned` },
    { icon: '🕐', label: 'Created',     value: formatDate(trip.created_at) },
  ];

  return (
    <div className="trip-detail">
      <button className="trip-detail__back" onClick={onBack}>
        ← Back to all trips
      </button>

      <div className="trip-detail__card">
        <div className="trip-detail__header">
          <div>
            <h2 className="trip-detail__name">{trip.name}</h2>
            <p className="trip-detail__route">
              {trip.route_source} → {trip.route_destination}
            </p>
          </div>
          <StatusBadge status={trip.status} />
        </div>

        <div className="trip-detail__stats">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="trip-detail__stat">
              <p className="trip-detail__stat-icon">{icon}</p>
              <p className="trip-detail__stat-label">{label}</p>
              <p className="trip-detail__stat-value">{value}</p>
            </div>
          ))}
        </div>

        <div className="trip-detail__actions">
          <Button
            onClick={() => navigate(`/routes/${trip.route_id || 1}`)}
          >
            🗺️ View Route
          </Button>
          <Button variant="danger" onClick={() => onDelete(trip)}>
            🗑️ Delete Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

const SavedTrips = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  //  REAL API CALL 
  // GET /trips
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await tripService.getAll();
        setTrips(res.data);
      } catch (err) {
        console.error('Failed to load trips:', err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  // REAL API CALL
  // DELETE /trips/{id}
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await tripService.delete(deleteTarget.id);
      setTrips((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      showToast('Trip deleted successfully', 'success');
      if (selectedTrip?.id === deleteTarget.id) setSelectedTrip(null);
    } catch (err) {
      showToast(
        err.response?.data?.detail || 'Failed to delete trip.',
        'error'
      );
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="saved-trips">
      <Navbar />

      <div className="saved-trips__content">
        <PageHeader
          title="My Trips"
          subtitle="Your saved and planned journeys"
          crumbs={[
            { label: 'Home', path: '/' },
            { label: 'My Trips' },
          ]}
        >
          <Button onClick={() => navigate('/search')}>
            + Plan New Trip
          </Button>
        </PageHeader>

        {loading ? (
          <Loader variant="list" count={3} />
        ) : trips.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No trips saved yet"
            subtitle="Find a route you love and start planning your first adventure!"
            actionLabel="Explore Routes"
            onAction={() => navigate('/search')}
          />
        ) : selectedTrip ? (
          <TripDetail
            trip={selectedTrip}
            onBack={() => setSelectedTrip(null)}
            onDelete={setDeleteTarget}
          />
        ) : (
          <div className="saved-trips__list">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={setSelectedTrip}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Trip?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Yes, Delete"
      />

      <Footer />
    </div>
  );
};

export default SavedTrips;