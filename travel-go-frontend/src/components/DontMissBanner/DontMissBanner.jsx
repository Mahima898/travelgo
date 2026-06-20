import './DontMissBanner.css';

const DontMissBanner = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="dont-miss">
      {/* Header */}
      <div className="dont-miss__header">
        <span className="dont-miss__bolt">⚡</span>
        <div>
          <h3 className="dont-miss__title">Don't Miss These</h3>
          <p className="dont-miss__subtitle">
            Things most travelers skip on this route
          </p>
        </div>
      </div>

      {/* Numbered list */}
      <div className="dont-miss__list">
        {items.map((item, index) => (
          <div key={index} className="dont-miss__item">
            <div className="dont-miss__number">{index + 1}</div>
            <p className="dont-miss__text">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DontMissBanner;