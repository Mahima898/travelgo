import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AppContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, role = 'user' }) => {
  const { isAuthenticated, isAdmin, authLoading } = useContext(AuthContext);
  const location = useLocation();

  
  if (authLoading) {
    return (
      <div className="protected-route-loader">
        <div className="protected-route-loader__spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  // Logged in but not admin → redirect to home
  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;