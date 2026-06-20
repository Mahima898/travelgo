import './Loader.css';


const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);


const CardSkeleton = () => (
  <div className="skeleton-card">
    <SkeletonBox className="skeleton-card__image" />
    <div className="skeleton-card__body">
      <SkeletonBox className="skeleton-card__title" />
      <SkeletonBox className="skeleton-card__line" />
      <SkeletonBox className="skeleton-card__line skeleton-card__line--short" />
      <div className="skeleton-card__tags">
        <SkeletonBox className="skeleton-card__tag" />
        <SkeletonBox className="skeleton-card__tag" />
      </div>
    </div>
  </div>
);


const ListSkeleton = () => (
  <div className="skeleton-list">
    <SkeletonBox className="skeleton-list__avatar" />
    <div className="skeleton-list__content">
      <SkeletonBox className="skeleton-list__title" />
      <SkeletonBox className="skeleton-list__line" />
    </div>
    <SkeletonBox className="skeleton-list__action" />
  </div>
);


const BannerSkeleton = () => (
  <div className="skeleton-banner">
    <SkeletonBox className="skeleton-banner__eyebrow" />
    <SkeletonBox className="skeleton-banner__title" />
    <SkeletonBox className="skeleton-banner__subtitle" />
    <div className="skeleton-banner__actions">
      <SkeletonBox className="skeleton-banner__btn" />
      <SkeletonBox className="skeleton-banner__btn" />
    </div>
  </div>
);

const Loader = ({ variant = 'spinner', count = 3 }) => {

  if (variant === 'banner') {
    return <BannerSkeleton />;
  }

  if (variant === 'list') {
    return (
      <div className="loader-list">
        {Array.from({ length: count }).map((_, i) => (
          <ListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="loader-grid">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  
  return (
    <div className="loader-spinner">
      <div className="loader-spinner__circle" />
      <p className="loader-spinner__text">Loading...</p>
    </div>
  );
};

export default Loader;