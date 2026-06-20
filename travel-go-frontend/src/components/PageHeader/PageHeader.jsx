import { Link } from 'react-router-dom';
import './PageHeader.css';

// ── BREADCRUMB ──
export const Breadcrumb = ({ crumbs = [] }) => (
  <nav className="breadcrumb">
    {crumbs.map((crumb, index) => (
      <span key={index} className="breadcrumb__item">
        {index > 0 && (
          <span className="breadcrumb__separator">›</span>
        )}
        {crumb.path ? (
          <Link to={crumb.path} className="breadcrumb__link">
            {crumb.label}
          </Link>
        ) : (
          <span className="breadcrumb__current">{crumb.label}</span>
        )}
      </span>
    ))}
  </nav>
);


export const PageHeader = ({
  title,
  subtitle,
  crumbs = [],
  children,
}) => (
  <div className="page-header">
    {crumbs.length > 0 && <Breadcrumb crumbs={crumbs} />}
    <div className="page-header__row">
      <div className="page-header__text">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && (
          <p className="page-header__subtitle">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="page-header__actions">{children}</div>
      )}
    </div>
  </div>
);


export const SectionHeading = ({
  title,
  subtitle,
  eyebrow = '',
  centered = false,
}) => (
  <div className={`section-heading ${centered ? 'section-heading--centered' : ''}`}>
    {eyebrow && (
      <span className="section-heading__eyebrow">{eyebrow}</span>
    )}
    <h2 className="section-heading__title">{title}</h2>
    {subtitle && (
      <p className="section-heading__subtitle">{subtitle}</p>
    )}
  </div>
);

export default PageHeader;