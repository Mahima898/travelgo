import { Link } from 'react-router-dom';
import './Footer.css';
import logoImg from '../../assets/travelgoo.png';

const Footer = () => (
  <footer className="footer">
    <div className="footer__container">

      {/* ── TOP GRID ── */}
      <div className="footer__grid">

        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
           <img
  src={logoImg}
  alt="TravelGo Logo"
  className="footer__logo-img"
/> 
            <span className="footer__logo-text">TravelGo</span>
            
          </div>
          <p className="footer__tagline">
            Don't just reach the destination.
            Explore the entire journey.
          </p>
        </div>

        {/* Explore Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Explore</h4>
          <Link to="/" className="footer__link">Home</Link>
          <Link to="/search" className="footer__link">All Routes</Link>
          <Link to="/search?tags=hidden-gems" className="footer__link">
            Hidden Gems
          </Link>
          <Link to="/search?tags=family" className="footer__link">
            Family Trips
          </Link>
        </div>

        {/* Account Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Account</h4>
          <Link to="/login" className="footer__link">Login</Link>
          <Link to="/register" className="footer__link">Register</Link>
          <Link to="/trips" className="footer__link">My Trips</Link>
          <Link to="/profile" className="footer__link">Profile</Link>
        </div>

        {/* Popular Routes */}
        <div className="footer__col">
          <h4 className="footer__col-title">Popular Routes</h4>
          <p className="footer__route">Delhi → Kashmir</p>
          <p className="footer__route">Delhi → Manali</p>
          <p className="footer__route">Delhi → Jaipur</p>
          <p className="footer__route">Delhi → Rishikesh</p>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} TravelGo. Built for travelers and explorers.
        </p>
        
      </div>

    </div>
  </footer>
);

export default Footer;