import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, ToastContext } from '../../context/AppContext';
import {
  validateLoginForm,
  validateRegisterForm,
  hasErrors,
} from '../../utils/utils';
import { FormError } from '../../components/Feedback/Feedback';
import Button from '../../components/Button/Button';
import './Auth.css';

const LoginForm = ({ onSuccess }) => {
  const { login } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLoginForm(form);
    if (hasErrors(errs)) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(form);
      showToast(`Welcome back, ${user.name.split(' ')[0]}! 🎉`, 'success');
      onSuccess(user.role === 'admin' ? '/admin' : '/');
    } catch {
      showToast('Invalid email or password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>

      {/* Email */}
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="login-email">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          value={form.email}
          onChange={setField('email')}
          placeholder="you@example.com"
          className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
          autoComplete="email"
        />
        <FormError message={errors.email} />
      </div>

      {/* Password */}
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="login-password">
          Password
        </label>
        <div className="auth-form__password-wrap">
          <input
            id="login-password"
            type={showPwd ? 'text' : 'password'}
            value={form.password}
            onChange={setField('password')}
            placeholder="Enter your password"
            className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="auth-form__eye"
            onClick={() => setShowPwd(!showPwd)}
            tabIndex={-1}
          >
            {showPwd ? '🙈' : '👁️'}
          </button>
        </div>
        <FormError message={errors.password} />
      </div>

      {/* Submit */}
      <Button type="submit" fullWidth loading={loading} size="lg">
        Login to TravelGo
      </Button>

      {/* Demo hint */}
      <div className="auth-form__demo">
        <p className="auth-form__demo-title">🔑 Demo Credentials</p>
        <p className="auth-form__demo-text">
          <strong>Admin:</strong> admin@test.com / anypassword
        </p>
        <p className="auth-form__demo-text">
          <strong>User:</strong> user@test.com / anypassword
        </p>
      </div>
    </form>
  );
};

const RegisterForm = ({ onSuccess }) => {
  const { register } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Password strength: 0 = none, 1 = weak, 2 = medium, 3 = strong
  const getStrength = () => {
    const p = form.password;
    if (!p) return 0;
    if (p.length < 6) return 1;
    if (p.length < 8) return 2;
    return 3;
  };
  const strength = getStrength();
  const strengthLabels = ['', 'Too short', 'Almost there', 'Strong ✓'];
  const strengthColors = ['', '#dc2626', '#d97706', '#16a34a'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegisterForm(form);
    if (hasErrors(errs)) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      showToast('Account created! Please log in.', 'success');
      navigate('/login');
    } catch {
      showToast('Registration failed. Email may already be in use.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>

      {/* Full Name */}
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="reg-name">
          Full Name
        </label>
        <input
          id="reg-name"
          type="text"
          value={form.name}
          onChange={setField('name')}
          placeholder="Your full name"
          className={`auth-form__input ${errors.name ? 'auth-form__input--error' : ''}`}
          autoComplete="name"
        />
        <FormError message={errors.name} />
      </div>

      {/* Email */}
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="reg-email">
          Email Address
        </label>
        <input
          id="reg-email"
          type="email"
          value={form.email}
          onChange={setField('email')}
          placeholder="you@example.com"
          className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
          autoComplete="email"
        />
        <FormError message={errors.email} />
      </div>

      {/* Password with strength */}
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="reg-password">
          Password
        </label>
        <div className="auth-form__password-wrap">
          <input
            id="reg-password"
            type={showPwd ? 'text' : 'password'}
            value={form.password}
            onChange={setField('password')}
            placeholder="Minimum 8 characters"
            className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="auth-form__eye"
            onClick={() => setShowPwd(!showPwd)}
            tabIndex={-1}
          >
            {showPwd ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Strength bar */}
        {form.password && (
          <div className="auth-form__strength">
            <div className="auth-form__strength-bar">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="auth-form__strength-segment"
                  style={{
                    background:
                      strength >= level
                        ? strengthColors[strength]
                        : '#e2e8f0',
                  }}
                />
              ))}
            </div>
            <span
              className="auth-form__strength-label"
              style={{ color: strengthColors[strength] }}
            >
              {strengthLabels[strength]}
            </span>
          </div>
        )}
        <FormError message={errors.password} />
      </div>

      {/* Confirm Password */}
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="reg-confirm">
          Confirm Password
        </label>
        <input
          id="reg-confirm"
          type="password"
          value={form.confirmPassword}
          onChange={setField('confirmPassword')}
          placeholder="Repeat your password"
          className={`auth-form__input ${errors.confirmPassword ? 'auth-form__input--error' : ''}`}
          autoComplete="new-password"
        />
        <FormError message={errors.confirmPassword} />
      </div>

      {/* Submit */}
      <Button type="submit" fullWidth loading={loading} size="lg">
        Create My Account
      </Button>
    </form>
  );
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const isLogin = location.pathname === '/login';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSuccess = (path) => {
    navigate(location.state?.from?.pathname || path || '/');
  };

  return (
    <div className="auth-page">

      {/* ── LEFT PANEL — branding ── */}
      <div className="auth-page__left">
        {/* Decorative circles */}
        <div className="auth-page__circle auth-page__circle--1" />
        <div className="auth-page__circle auth-page__circle--2" />

        <div className="auth-page__branding">
          {/* Logo */}
          <Link to="/" className="auth-page__logo">
            <div className="auth-page__logo-icon">🗺️</div>
            <span className="auth-page__logo-text">TravelGo</span>
          </Link>

          <h1 className="auth-page__tagline">
            Explore more than just the destination
          </h1>
          <p className="auth-page__sub">
            Discover hidden gems, local food, and must-visit spots
            at every stop along your journey.
          </p>

          {/* Feature list */}
          <div className="auth-page__features">
            {[
              '💎 Hidden Gems Discovery',
              '📸 Photography Spots',
              '🍛 Local Food Guide',
              '🗓️ Day-wise Itineraries',
              '💰 Budget Planning',
            ].map((f) => (
              <div key={f} className="auth-page__feature-item">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="auth-page__right">
        <div className="auth-page__form-wrap">

          {/* Back to home */}
          <Link to="/" className="auth-page__back">
            ← Back to Home
          </Link>

          {/* Heading */}
          <h2 className="auth-page__form-title">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="auth-page__form-subtitle">
            {isLogin
              ? 'Log in to access your saved trips and plans'
              : 'Start planning your dream journeys today'}
          </p>

          {/* Tab switcher */}
          <div className="auth-page__tabs">
            <Link
              to="/login"
              className={`auth-page__tab ${isLogin ? 'auth-page__tab--active' : ''}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`auth-page__tab ${!isLogin ? 'auth-page__tab--active' : ''}`}
            >
              Register
            </Link>
          </div>

          {/* Form */}
          {isLogin
            ? <LoginForm onSuccess={handleSuccess} />
            : <RegisterForm onSuccess={handleSuccess} />
          }

          {/* Switch link */}
          <p className="auth-page__switch">
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="auth-page__switch-link"
            >
              {isLogin ? 'Register free' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;