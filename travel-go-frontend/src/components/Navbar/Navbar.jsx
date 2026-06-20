import { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* ── LOGO ── */}
      <NavLink to="/" className="navbar__logo">
  <img
    src="/src/assets/travelgoo.png"
    alt="TravelGo Logo"
    className="navbar__logo-img"
  />
  <span className="navbar__logo-text">TravelGo</span>
</NavLink>
        
        {/* ── DESKTOP NAV ── */}
        <nav className="navbar__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            🗺️ Explore Routes
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/trips"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              💾 My Trips
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              ⚙️ Admin
            </NavLink>
          )}
        </nav>

        {/* ── AUTH BUTTONS / USER MENU ── */}
        <div className="navbar__actions">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="navbar__btn navbar__btn--ghost">
                Login
              </NavLink>
              <NavLink to="/register" className="navbar__btn navbar__btn--primary">
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="navbar__user">
              <button
                className="navbar__avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="navbar__avatar-initials">
                  {getInitials(user?.name)}
                </span>
                <span className="navbar__avatar-name">{user?.name?.split(' ')[0]}</span>
                <span className="navbar__avatar-chevron">▾</span>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="navbar__dropdown-backdrop"
                    onClick={() => setDropdownOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-header">
                      <p className="navbar__dropdown-name">{user?.name}</p>
                      <p className="navbar__dropdown-email">{user?.email}</p>
                    </div>

                    <div className="navbar__dropdown-links">
                      <NavLink
                        to="/profile"
                        className="navbar__dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        👤 My Profile
                      </NavLink>

                      <NavLink
                        to="/trips"
                        className="navbar__dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        💾 My Trips
                      </NavLink>

                      {isAdmin && (
                        <NavLink
                          to="/admin"
                          className="navbar__dropdown-link"
                          onClick={() => setDropdownOpen(false)}
                        >
                          ⚙️ Admin Panel
                        </NavLink>
                      )}
                    </div>

                    <div className="navbar__dropdown-footer">
                      <button
                        className="navbar__dropdown-logout"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── MOBILE MENU BUTTON ── */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="navbar__mobile">
          <NavLink
            to="/"
            end
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/search"
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            🗺️ Explore Routes
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/trips"
                className="navbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                💾 My Trips
              </NavLink>

              <NavLink
                to="/profile"
                className="navbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                👤 My Profile
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="navbar__mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  ⚙️ Admin Panel
                </NavLink>
              )}

              <button
                className="navbar__mobile-logout"
                onClick={() => { handleLogout(); setMenuOpen(false); }}
              >
                🚪 Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div className="navbar__mobile-auth">
              <NavLink
                to="/login"
                className="navbar__btn navbar__btn--ghost"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="navbar__btn navbar__btn--primary"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;