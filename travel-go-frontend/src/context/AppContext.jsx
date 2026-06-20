import { createContext, useState, useEffect, useCallback } from 'react';
import { getStorage, setStorage, clearAuthStorage, STORAGE_KEYS } from '../utils/utils';
import { authService } from '../services/services';

export const ToastContext = createContext(null);
export const AuthContext = createContext(null);
export const TripContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  
  useEffect(() => {
    const storedToken = getStorage(STORAGE_KEYS.TOKEN);
    const storedUser = getStorage(STORAGE_KEYS.USER);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setAuthLoading(false);
  }, []);

  
  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const { access_token, user: userData } = res.data;

    setToken(access_token);
    setUser(userData);
    setStorage(STORAGE_KEYS.TOKEN, access_token);
    setStorage(STORAGE_KEYS.USER, userData);
    return userData;
  }, []);

  
  const register = useCallback(async (userData) => {
    await authService.register(userData);
    return { success: true };
  }, []);

  
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuthStorage();
  }, []);

  
  const updateUser = useCallback((updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    setStorage(STORAGE_KEYS.USER, updated);
  }, [user]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      authLoading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState(() => {
    return getStorage(STORAGE_KEYS.CURRENT_TRIP) || null;
  });

  useEffect(() => {
    if (currentTrip) {
      setStorage(STORAGE_KEYS.CURRENT_TRIP, currentTrip);
    }
  }, [currentTrip]);

  const initTrip = useCallback((route, baseItinerary) => {
    const trip = {
      route_id: route.id,
      route_name: route.name,
      route_source: route.source,
      route_destination: route.destination,
      name: `My ${route.destination} Trip`,
      start_date: '',
      days: baseItinerary?.days?.map((day) => ({
        ...day,
        activities: day.activities?.map((act) => ({
          ...act,
          included: true,
        })) || [],
        note: '',
      })) || [],
    };
    setCurrentTrip(trip);
    return trip;
  }, []);

  const toggleActivity = useCallback((dayIndex, activityId) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.map((act) =>
            act.id === activityId
              ? { ...act, included: !act.included }
              : act
          ),
        };
      });
      return { ...prev, days: updatedDays };
    });
  }, []);

  const updateDayNote = useCallback((dayIndex, note) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day, idx) =>
        idx === dayIndex ? { ...day, note } : day
      );
      return { ...prev, days: updatedDays };
    });
  }, []);

  const setTripField = useCallback((field, value) => {
    setCurrentTrip((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const resetTrip = useCallback(() => {
    setCurrentTrip(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TRIP);
  }, []);

  return (
    <TripContext.Provider value={{
      currentTrip,
      initTrip,
      toggleActivity,
      updateDayNote,
      setTripField,
      resetTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <TripProvider>
          {children}
        </TripProvider>
      </AuthProvider>
    </ToastProvider>
  );
};