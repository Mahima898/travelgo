import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AppContext';
import StatCard from '../../../components/StatCard/StatCard';
import { adminService } from '../../../services/services';
import './AdminDashboard.css';

const RECENT_ACTIVITY = [
  { id: 1, action: 'New route added',  detail: 'Delhi to Leh — Ladakh Epic',      time: '2 hours ago', icon: '🗺️' },
  { id: 2, action: 'User registered',  detail: 'Priya Sharma joined TravelGo',    time: '4 hours ago', icon: '👤' },
  { id: 3, action: 'Trip saved',       detail: 'Rahul Kumar saved Kashmir trip',   time: '6 hours ago', icon: '💾' },
  { id: 4, action: 'Attraction added', detail: 'Vaishno Devi added to Jammu stop', time: '1 day ago',   icon: '🏛️' },
  { id: 5, action: 'Food tip added',   detail: 'Rajma Chawal — Kesar Da Dhaba',   time: '1 day ago',   icon: '🍛' },
];

const QUICK_LINKS = [
  { to: '/admin/routes',       label: 'Manage Routes',       icon: '🗺️', color: '#1a6b4a' },
  { to: '/admin/destinations', label: 'Manage Destinations', icon: '📍', color: '#2563eb' },
  { to: '/admin/attractions',  label: 'Manage Attractions',  icon: '🏛️', color: '#7c3aed' },
  { to: '/admin/food',         label: 'Manage Food',         icon: '🍛', color: '#d97706' },
  { to: '/admin/tips',         label: 'Manage Tips',         icon: '💡', color: '#0f766e' },
  { to: '/admin/itineraries',  label: 'Manage Itineraries',  icon: '📅', color: '#dc2626' },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const STAT_CONFIG = stats ? [
    { icon: '🗺️', value: stats.routes,       label: 'Routes',       color: '#1a6b4a' },
    { icon: '📍', value: stats.destinations, label: 'Destinations', color: '#2563eb' },
    { icon: '🏛️', value: stats.attractions,  label: 'Attractions',  color: '#7c3aed' },
    { icon: '🍛', value: stats.food,         label: 'Food Tips',    color: '#d97706' },
    { icon: '💡', value: stats.tips,         label: 'Travel Tips',  color: '#0f766e' },
    { icon: '📅', value: stats.itineraries,  label: 'Itineraries',  color: '#dc2626' },
    { icon: '👤', value: stats.users,        label: 'Users',        color: '#475569' },
    { icon: '💾', value: stats.trips,        label: 'Saved Trips',  color: '#db2777' },
  ] : [];

  return (
    <div className="admin-dashboard">

      {/* Welcome banner */}
      <div className="admin-welcome">
        <div className="admin-welcome__circle" />
        <div className="admin-welcome__content">
          <p className="admin-welcome__greeting">Welcome back,</p>
          <h1 className="admin-welcome__name">{user?.name} 👋</h1>
          <p className="admin-welcome__sub">
            Here's what's happening with TravelGo today.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="admin-dashboard__stats">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="admin-stat-skeleton" />
            ))
          : STAT_CONFIG.map((s) => (
              <StatCard key={s.label} {...s} compact />
            ))}
      </div>

      {/* Bottom grid */}
      <div className="admin-dashboard__bottom">

        {/* Quick links */}
        <div>
          <h2 className="admin-dashboard__section-title">Quick Actions</h2>
          <div className="admin-quick-links">
            {QUICK_LINKS.map(({ to, label, icon, color }) => (
              <button
                key={to}
                className="admin-quick-link"
                onClick={() => navigate(to)}
                style={{ '--link-color': color }}
              >
                <div
                  className="admin-quick-link__icon"
                  style={{ background: `${color}18` }}
                >
                  {icon}
                </div>
                <span className="admin-quick-link__label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="admin-dashboard__section-title">Recent Activity</h2>
          <div className="admin-activity">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={item.id}
                className="admin-activity__item"
                style={{
                  borderBottom:
                    i < RECENT_ACTIVITY.length - 1
                      ? '1px solid #f8fafc'
                      : 'none',
                }}
              >
                <div className="admin-activity__icon">{item.icon}</div>
                <div className="admin-activity__body">
                  <p className="admin-activity__action">{item.action}</p>
                  <p className="admin-activity__detail">{item.detail}</p>
                </div>
                <span className="admin-activity__time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;