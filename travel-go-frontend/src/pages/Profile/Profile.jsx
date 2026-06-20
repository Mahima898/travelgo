import { useState, useContext } from 'react';
import { AuthContext, ToastContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { FormError } from '../../components/Feedback/Feedback';
import Button from '../../components/Button/Button';
import { userService } from '../../services/services';
import { getInitials, isValidEmail, isRequired } from '../../utils/utils';
import './Profile.css';

const TABS = [
  { id: 'profile',  label: '👤 Profile' },
  { id: 'password', label: '🔒 Password' },
  { id: 'account',  label: '⚙️ Account Info' },
];


const ProfileForm = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!isRequired(form.name)) errs.name = 'Name is required';
    if (!isValidEmail(form.email)) errs.email = 'Enter a valid email';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await userService.updateProfile(form);
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(
        err.response?.data?.detail || 'Failed to update profile.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <h3 className="profile-form__title">Edit Profile</h3>

      <div className="profile-form__group">
        <label className="profile-form__label">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={setField('name')}
          className={`profile-form__input ${errors.name ? 'profile-form__input--error' : ''}`}
          placeholder="Your full name"
        />
        <FormError message={errors.name} />
      </div>

      <div className="profile-form__group">
        <label className="profile-form__label">Email Address</label>
        <input
          type="email"
          value={form.email}
          onChange={setField('email')}
          className={`profile-form__input ${errors.email ? 'profile-form__input--error' : ''}`}
          placeholder="you@example.com"
        />
        <FormError message={errors.email} />
      </div>

      <Button type="submit" loading={loading}>Save Changes</Button>
    </form>
  );
};

// PASSWORD FORM
const PasswordForm = () => {
  const { showToast } = useContext(ToastContext);
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // REAL API CALL
  // PUT /users/me/password
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.current_password) errs.current_password = 'Enter current password';
    if (!form.new_password || form.new_password.length < 8)
      errs.new_password = 'Minimum 8 characters';
    if (form.new_password !== form.confirm_password)
      errs.confirm_password = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await userService.changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      showToast('Password changed successfully!', 'success');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      showToast(
        err.response?.data?.detail || 'Failed to change password.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'current_password', label: 'Current Password' },
    { key: 'new_password',     label: 'New Password (min 8 characters)' },
    { key: 'confirm_password', label: 'Confirm New Password' },
  ];

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <h3 className="profile-form__title">Change Password</h3>
      {fields.map(({ key, label }) => (
        <div key={key} className="profile-form__group">
          <label className="profile-form__label">{label}</label>
          <input
            type="password"
            value={form[key]}
            onChange={setField(key)}
            className={`profile-form__input ${errors[key] ? 'profile-form__input--error' : ''}`}
            placeholder="••••••••"
          />
          <FormError message={errors[key]} />
        </div>
      ))}
      <Button type="submit" loading={loading}>Update Password</Button>
    </form>
  );
};

//  ACCOUNT INFO
const AccountInfo = ({ user }) => {
  const rows = [
    { label: 'Full Name',    value: user?.name },
    { label: 'Email',        value: user?.email },
    { label: 'Role',         value: user?.role },
    {
      label: 'Member Since',
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
          })
        : 'N/A',
    },
  ];

  return (
    <div className="account-info">
      <h3 className="profile-form__title">Account Information</h3>
      {rows.map(({ label, value }) => (
        <div key={label} className="account-info__row">
          <span className="account-info__label">{label}</span>
          <span className="account-info__value">{value}</span>
        </div>
      ))}
    </div>
  );
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-page__content">
        <PageHeader
          title="My Profile"
          subtitle="Manage your account settings"
          crumbs={[
            { label: 'Home', path: '/' },
            { label: 'Profile' },
          ]}
        />

        <div className="profile-page__grid">

          {/* Sidebar */}
          <div className="profile-page__sidebar">
            <div className="profile-avatar-card">
              <div className="profile-avatar-card__avatar">
                {getInitials(user?.name)}
              </div>
              <h3 className="profile-avatar-card__name">{user?.name}</h3>
              <p className="profile-avatar-card__email">{user?.email}</p>
              <span
                className="profile-avatar-card__role"
                style={{
                  background: user?.role === 'admin' ? '#f3e8ff' : '#e8f5ef',
                  color: user?.role === 'admin' ? '#7c3aed' : '#1a6b4a',
                }}
              >
                {user?.role}
              </span>
            </div>

            <nav className="profile-tab-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`profile-tab-nav__btn ${activeTab === tab.id ? 'profile-tab-nav__btn--active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="profile-page__main">
            {activeTab === 'profile'  && <ProfileForm />}
            {activeTab === 'password' && <PasswordForm />}
            {activeTab === 'account'  && <AccountInfo user={user} />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;