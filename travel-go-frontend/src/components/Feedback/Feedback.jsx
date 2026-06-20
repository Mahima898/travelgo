import { useContext } from 'react';
import { ToastContext } from '../../context/AppContext';
import Button from '../Button/Button';
import './Feedback.css';

export const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <span className="form-error">
      <span className="form-error__icon">⚠</span>
      {message}
    </span>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div className="error-message">
      <span className="error-message__icon">⚠️</span>
      <div className="error-message__content">
        <p className="error-message__title">Something went wrong</p>
        <p className="error-message__text">{message}</p>
      </div>
      {onRetry && (
        <button className="error-message__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export const EmptyState = ({
  icon = '🗺️',
  title = 'Nothing here yet',
  subtitle = '',
  actionLabel = '',
  onAction = null,
}) => (
  <div className="empty-state">
    <div className="empty-state__icon">{icon}</div>
    <h3 className="empty-state__title">{title}</h3>
    {subtitle && (
      <p className="empty-state__subtitle">{subtitle}</p>
    )}
    {onAction && actionLabel && (
      <div className="empty-state__action">
        <Button onClick={onAction}>{actionLabel}</Button>
      </div>
    )}
  </div>
);


const ToastNotification = ({ message, type = 'info', onClose }) => (
  <div className={`toast toast--${type}`}>
    <div className={`toast__icon toast__icon--${type}`}>
      {{ success: '✓', error: '✕', warning: '!', info: 'i' }[type]}
    </div>
    <p className="toast__message">{message}</p>
    <button className="toast__close" onClick={onClose}>×</button>
  </div>
);

export const ToastContainer = () => {
  const context = useContext(ToastContext);
  if (!context) return null;
  const { toasts, removeToast } = context;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};