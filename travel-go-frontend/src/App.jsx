import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { ToastContainer } from './components/Feedback/Feedback';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminLayout from './components/AdminLayout/AdminLayout';

// Public Pages
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import RouteExplorer from './pages/RouteExplorer/RouteExplorer';
import DestinationDetail from './pages/DestinationDetail/DestinationDetail';
import NotFound from './pages/NotFound/NotFound';

// Auth Pages
import Auth from './pages/Auth/Auth';

// User Pages
import TripPlanner from './pages/TripPlanner/TripPlanner';
import SavedTrips from './pages/SavedTrips/SavedTrips';
import Profile from './pages/Profile/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import AdminRoutes from './pages/admin/AdminRoutes/AdminRoutes';
import AdminDestinations from './pages/admin/AdminDestinations/AdminDestinations';
import AdminAttractions from './pages/admin/AdminAttractions/AdminAttractions';
import AdminFood from './pages/admin/AdminFood/AdminFood';
import AdminTips from './pages/admin/AdminTips/AdminTips';
import AdminItineraries from './pages/admin/AdminItineraries/AdminItineraries';

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <ToastContainer />
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/routes/:id" element={<RouteExplorer />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />

          {/* AUTH */}
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* USER */}
          <Route path="/plan/:routeId" element={<ProtectedRoute role="user"><TripPlanner /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute role="user"><SavedTrips /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="routes" element={<AdminRoutes />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="attractions" element={<AdminAttractions />} />
            <Route path="food" element={<AdminFood />} />
            <Route path="tips" element={<AdminTips />} />
            <Route path="itineraries" element={<AdminItineraries />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
