import { useContext } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AppContext';
import './AdminLayout.css';


const NAV_ITEMS = [
  { to: '/admin',              label: 'Dashboard',    icon: '📊', exact: true },
  { to: '/admin/routes',       label: 'Routes',       icon: '🗺️' },
  { to: '/admin/destinations', label: 'Destinations', icon: '📍' },
  { to: '/admin/attractions',  label: 'Attractions',  icon: '🏛️' },
  { to: '/admin/food',         label: 'Food',         icon: '🍛' },
  { to: '/admin/tips',         label: 'Travel Tips',  icon: '💡' },
  { to: '/admin/itineraries',  label: 'Itineraries',  icon: '📅' },
];

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, authLoading } = useContext(AuthContext);
  const location = useLocation();

  
  if (authLoading) {
    return (
      <div className="admin-loader">
        <div className="admin-loader__spinner" />
      </div>
    );
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname === to;
  };

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-sidebar__logo">
          <Link to="/" className="admin-sidebar__logo-link">
            <div className="admin-sidebar__logo-icon">🗺️</div>
            <div className="admin-sidebar__logo-text">
              <span className="admin-sidebar__brand">TravelGo</span>
              <span className="admin-sidebar__panel">ADMIN PANEL</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon, exact }) => (
            <Link
              key={to}
              to={to}
              className={`admin-sidebar__link ${isActive(to, exact) ? 'admin-sidebar__link--active' : ''}`}
            >
              <span className="admin-sidebar__link-icon">{icon}</span>
              <span className="admin-sidebar__link-label">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Back to site */}
        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__back">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;