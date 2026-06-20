import './TagFilterBar.css';

const ALL_TAGS = [
  { label: 'Family',      icon: '👨‍👩‍👧' },
  { label: 'Adventure',   icon: '🏔️' },
  { label: 'Food',        icon: '🍛' },
  { label: 'Photography', icon: '📸' },
  { label: 'Nature',      icon: '🌿' },
  { label: 'Budget',      icon: '💰' },
  { label: 'Heritage',    icon: '🏛️' },
];

const TagFilterBar = ({ selectedTags = [], onFilterChange }) => {

  const handleClick = (label) => {
    if (selectedTags.includes(label)) {
      onFilterChange([]);
    } else {
      onFilterChange([label]);
    }
  };

  return (
    <div className="tag-filter-bar">
      <button
        className={`tag-filter-bar__tag ${
          selectedTags.length === 0 ? 'tag-filter-bar__tag--active' : ''
        }`}
        onClick={() => onFilterChange([])}
      >
        🗺️ All Routes
      </button>

      {ALL_TAGS.map(({ label, icon }) => (
        <button
          key={label}
          className={`tag-filter-bar__tag ${
            selectedTags.includes(label) ? 'tag-filter-bar__tag--active' : ''
          }`}
          onClick={() => handleClick(label)}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
};

export default TagFilterBar;