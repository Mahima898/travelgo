import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Itinerary from '../../components/Itinerary/Itinerary';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { Breadcrumb } from '../../components/PageHeader/PageHeader';
import { TripContext, ToastContext } from '../../context/AppContext';
import { routeService, itineraryService, tripService } from '../../services/services';
import { formatDate, addDays } from '../../utils/utils';
import './TripPlanner.css';

const TripPlanner = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { currentTrip, initTrip, setTripField, resetTrip } = useContext(TripContext);
  const { showToast } = useContext(ToastContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //  REAL API CALLS 
  // GET /routes/{id}
  // GET /itineraries/route/{id}
  useEffect(() => {
    const loadData = async () => {
      try {
        const routeIdInt = parseInt(routeId);

        
        const routeRes = await routeService.getById(routeIdInt);
        const route = routeRes.data;

        try {
          
          const itineraryRes = await itineraryService.getByRouteId(routeIdInt);
          initTrip(route, itineraryRes.data);
        } catch {
          
          const fallbackItinerary = {
            days: Array.from(
              { length: route.duration_min || 3 },
              (_, i) => ({
                id: i + 1,
                day_number: i + 1,
                title: `Day ${i + 1}`,
                destination_name:
                  i === 0 ? route.source : route.destination,
                activities: [
                  {
                    id: (i * 3) + 1,
                    name: 'Morning sightseeing',
                    time_slot: 'Morning',
                    type: 'attraction',
                  },
                  {
                    id: (i * 3) + 2,
                    name: 'Local food experience',
                    time_slot: 'Afternoon',
                    type: 'food',
                  },
                  {
                    id: (i * 3) + 3,
                    name: 'Evening exploration',
                    time_slot: 'Evening',
                    type: 'general',
                  },
                ],
                note: '',
              })
            ),
          };
          initTrip(route, fallbackItinerary);
        }

      } catch (err) {
        console.error('Failed to load trip data:', err);
        showToast('Failed to load route data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [routeId]);

  
  const endDate =
    currentTrip?.start_date && currentTrip?.days?.length
      ? addDays(currentTrip.start_date, currentTrip.days.length - 1)
      : null;

  
  const totalSelected =
    currentTrip?.days?.reduce(
      (sum, day) =>
        sum +
        (day.activities?.filter((a) => a.included !== false).length || 0),
      0
    ) || 0;

  //  REAL API CALL
  // POST /trips
  const handleSave = async () => {
    if (!currentTrip) return;

    if (!currentTrip.start_date) {
      showToast('Please select a start date for your trip', 'warning');
      return;
    }

    setSaving(true);
    try {
      await tripService.save({
        route_id: currentTrip.route_id,
        name: currentTrip.name,
        route_source: currentTrip.route_source,
        route_destination: currentTrip.route_destination,
        start_date: currentTrip.start_date,
        days_count: currentTrip.days?.length || 0,
        total_activities: totalSelected,
        customized_days: currentTrip.days || [],
      });

      showToast('Trip saved successfully! 🎉', 'success');
      resetTrip();
      navigate('/trips');
    } catch (err) {
      showToast(
        err.response?.data?.detail || 'Failed to save trip. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Discard all changes and leave?')) {
      resetTrip();
      navigate(`/routes/${routeId}`);
    }
  };

  if (loading || !currentTrip) {
    return (
      <div className="trip-planner">
        <Navbar />
        <div className="trip-planner__loading">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="trip-planner">
      <Navbar />

      <div className="trip-planner__content">
        <Breadcrumb
          crumbs={[
            { label: 'Home', path: '/' },
            { label: currentTrip.route_name || 'Route', path: `/routes/${routeId}` },
            { label: 'Plan Trip' },
          ]}
        />

        <div className="trip-planner__grid">

          {/* Left — customizer */}
          <div className="trip-planner__left">
            <div className="trip-setup-card">
              <h2 className="trip-setup-card__title">Customize Your Trip</h2>
              <p className="trip-setup-card__subtitle">
                Toggle activities on/off, add personal notes, and set your travel dates.
              </p>

              <div className="trip-setup-card__fields">
                {/* Trip name */}
                <div className="trip-setup-card__field">
                  <label className="trip-setup-card__label">Trip Name</label>
                  <input
                    type="text"
                    className="trip-setup-card__input"
                    value={currentTrip.name || ''}
                    onChange={(e) => setTripField('name', e.target.value)}
                    placeholder="e.g. My Kashmir Adventure"
                  />
                </div>

                {/* Start date */}
                <div className="trip-setup-card__field">
                  <label className="trip-setup-card__label">Start Date</label>
                  <input
                    type="date"
                    className="trip-setup-card__input"
                    value={currentTrip.start_date || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTripField('start_date', e.target.value)}
                  />
                  {currentTrip.start_date && endDate && (
                    <p className="trip-setup-card__date-range">
                      📅 {formatDate(currentTrip.start_date)} → {formatDate(endDate)}
                      &nbsp;({currentTrip.days.length} days)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive itinerary */}
            <Itinerary itinerary={currentTrip} interactive />
          </div>

          {/* Right — summary sidebar */}
          <div className="trip-planner__sidebar">
            <div className="trip-summary-card">
              <div className="trip-summary-card__header">
                <p className="trip-summary-card__eyebrow">Your Trip</p>
                <h3 className="trip-summary-card__name">{currentTrip.name}</h3>
              </div>

              <div className="trip-summary-card__details">
                {[
                  {
                    label: 'Route',
                    value: `${currentTrip.route_source} → ${currentTrip.route_destination}`,
                  },
                  {
                    label: 'Duration',
                    value: `${currentTrip.days?.length || 0} Days`,
                  },
                  {
                    label: 'Activities',
                    value: `${totalSelected} selected`,
                  },
                  {
                    label: 'Start',
                    value: currentTrip.start_date
                      ? formatDate(currentTrip.start_date)
                      : 'Not set',
                  },
                  {
                    label: 'End',
                    value: endDate ? formatDate(endDate) : 'Not set',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="trip-summary-card__row">
                    <span className="trip-summary-card__label">{label}</span>
                    <span className="trip-summary-card__value">{value}</span>
                  </div>
                ))}
              </div>

              <div className="trip-summary-card__actions">
                <Button fullWidth loading={saving} onClick={handleSave} size="lg">
                  💾 Save Trip
                </Button>
                <Button variant="ghost" fullWidth onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>

              <p className="trip-summary-card__note">
                Your trip will be saved to "My Trips" and can be edited anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripPlanner;