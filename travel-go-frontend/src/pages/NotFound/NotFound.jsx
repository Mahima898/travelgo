import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound">
      <Navbar />

      <div className="notfound__content">
        <div className="notfound__icon">🗺️</div>

        <h1 className="notfound__title">Lost on the road?</h1>

        <p className="notfound__subtitle">
          This page doesn't exist — but your next adventure does.
        </p>

        <div className="notfound__actions">
          <button
            className="notfound__btn notfound__btn--primary"
            onClick={() => navigate('/')}
          >
            🏠 Go Home
          </button>
          <button
            className="notfound__btn notfound__btn--secondary"
            onClick={() => navigate('/search')}
          >
            🔍 Explore Routes
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;