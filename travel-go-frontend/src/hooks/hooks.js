import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, TripContext, ToastContext } from '../context/AppContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AppProvider');
  }
  return context;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used inside AppProvider');
  }
  return context;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside AppProvider');
  }
  return context;
};

export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchFn();
      // FastAPI returns data in res.data (axios convention)
      setData(res.data);
    } catch (err) {
      // FastAPI error detail comes in err.response.data.detail
      setError(
        err.response?.data?.detail || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup — cancel timer if value changes before delay
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      // If click is inside the element — do nothing
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [handler]);

  return ref;
};

export const useLocalData = (key, mockData = []) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : mockData;
    } catch {
      return mockData;
    }
  });

  const updateData = useCallback(
    (newData) => {
      setData(newData);
      localStorage.setItem(key, JSON.stringify(newData));
    },
    [key]
  );

  return [data, updateData];
};

export const useUnsavedChanges = (isDirty) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  
  const safeNavigate = useCallback(
    (path) => {
      if (!isDirty || window.confirm('You have unsaved changes. Leave anyway?')) {
        navigate(path);
      }
    },
    [isDirty, navigate]
  );

  return { safeNavigate };
};