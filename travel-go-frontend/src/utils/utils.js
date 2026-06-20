export const STORAGE_KEYS = {
  TOKEN: 'tg_token',
  USER: 'tg_user',
  CURRENT_TRIP: 'tg_current_trip',
};

export const getStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('localStorage write failed');
  }
};

export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error('localStorage remove failed');
  }
};

export const clearAuthStorage = () => {
  removeStorage(STORAGE_KEYS.TOKEN);
  removeStorage(STORAGE_KEYS.USER);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const startStr = start.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
  if (!end) return startStr;
  const endStr = end.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
};


export const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};


export const formatBudget = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};


export const formatBudgetRange = (min, max) => {
  if (!min && !max) return 'Budget not specified';
  if (!max) return `From ${formatBudget(min)}`;
  return `${formatBudget(min)} – ${formatBudget(max)}`;
};


export const formatDuration = (minDays, maxDays) => {
  if (!minDays) return '';
  if (!maxDays || minDays === maxDays) {
    return `${minDays} Day${minDays > 1 ? 's' : ''}`;
  }
  return `${minDays}–${maxDays} Days`;
};


export const formatStopCount = (count) => {
  if (!count) return '0 Stops';
  return `${count} Stop${count !== 1 ? 's' : ''}`;
};


export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};


export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

export const isPasswordStrong = (password) => {
  return password && password.length >= 8;
};

export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

// Returns errors object — empty means no errors
export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!isRequired(email)) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!isRequired(password)) errors.password = 'Password is required';
  return errors;
};


export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!isRequired(name)) errors.name = 'Full name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!isRequired(email)) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!isRequired(password)) errors.password = 'Password is required';
  else if (!isPasswordStrong(password)) errors.password = 'Password must be at least 8 characters';
  if (!isRequired(confirmPassword)) errors.confirmPassword = 'Please confirm your password';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};


export const hasErrors = (errorsObj) => Object.keys(errorsObj).length > 0;