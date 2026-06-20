import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/hooks';
import { routeService } from '../../services/services';
import './SearchBar.css';


const DEFAULT_DESTINATIONS = [
  'Delhi', 'Mumbai', 'Kashmir', 'Manali', 'Jaipur',
  'Rishikesh', 'Goa', 'Shimla', 'Leh', 'Chandigarh',
  'Haridwar', 'Dehradun', 'Agra', 'Amritsar', 'Udaipur',
];


const SuggestionDropdown = ({ suggestions, activeIndex, onSelect, onHover, visible }) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <ul className="suggestions">
      {suggestions.map((name, index) => (
        <li
          key={name}
          className={`suggestions__item ${index === activeIndex ? 'suggestions__item--active' : ''}`}
          onMouseDown={() => onSelect(name)}
          onMouseEnter={() => onHover(index)}
        >
          <span className="suggestions__pin">📍</span>
          <span className="suggestions__name">{name}</span>
        </li>
      ))}
    </ul>
  );
};


const SearchInput = ({ value, onChange, onSelect, placeholder, icon, id, destinations }) => {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const debouncedValue = useDebounce(value, 150);

  
  const suggestions =
    debouncedValue.length >= 1
      ? destinations.filter(
          (d) =>
            d.toLowerCase().startsWith(debouncedValue.toLowerCase()) &&
            d.toLowerCase() !== debouncedValue.toLowerCase()
        ).slice(0, 7)
      : [];

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions.length]);

  const handleKeyDown = (e) => {
    if (!focused || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (name) => {
    onSelect(name);
    setFocused(false);
    setActiveIndex(-1);
  };

  return (
    <div className="search-input">
      <div className={`search-input__box ${focused ? 'search-input__box--focused' : ''}`}>
        <span className="search-input__icon">{icon}</span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input__field"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-input__clear"
            onMouseDown={(e) => {
              e.preventDefault();
              onChange('');
              inputRef.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>

      <SuggestionDropdown
        suggestions={suggestions}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        onHover={setActiveIndex}
        visible={focused}
      />
    </div>
  );
};


const SearchBar = ({ initialFrom = '', initialTo = '', onSearch, large = false }) => {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const navigate = useNavigate();

  
  useEffect(() => {
    const loadNames = async () => {
      try {
        const res = await routeService.getDestinationNames();
        if (res.data && res.data.length > 0) {
          setDestinations(res.data);
        }
      } catch {
        
      }
    };
    loadNames();
  }, []);

  const canSearch = from.trim().length > 0 && to.trim().length > 0;

  const handleSearch = () => {
    if (!canSearch) return;
    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
    });
    if (onSearch) {
      onSearch(from.trim(), to.trim());
    } else {
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div
      className={`searchbar ${large ? 'searchbar--large' : ''}`}
      onKeyDown={handleKeyDown}
    >
      <SearchInput
        id="search-from"
        value={from}
        onChange={setFrom}
        onSelect={setFrom}
        placeholder="From — Starting city"
        icon="🛫"
        destinations={destinations}
      />

      <div className="searchbar__divider" />

      <SearchInput
        id="search-to"
        value={to}
        onChange={setTo}
        onSelect={setTo}
        placeholder="To — Destination"
        icon="📍"
        destinations={destinations}
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={!canSearch}
        className={`searchbar__btn ${canSearch ? 'searchbar__btn--active' : ''}`}
      >
        <span>🔍</span>
        <span>{large ? 'Explore Route' : 'Search'}</span>
      </button>
    </div>
  );
};

export default SearchBar;