import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import SearchBar from '../../components/SearchBar/SearchBar';
import RouteCard from '../../components/RouteCard/RouteCard';
import TagFilterBar from '../../components/TagFilterBar/TagFilterBar';
import Loader from '../../components/Loader/Loader';
import { EmptyState } from '../../components/Feedback/Feedback';
import { routeService } from '../../services/services';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  const [allResults, setAllResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  // REAL API CALL
  useEffect(() => {
    const searchRoutes = async () => {
      try {
        setLoading(true);
        setSelectedTags([]);

        let res;
        if (from || to) {
          // Search with query params
          res = await routeService.search(from, to);
        } else {
          // Get all routes
          res = await routeService.getAll();
        }

        setAllResults(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Search failed:', err);
        setAllResults([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    searchRoutes();
  }, [from, to]);

  // Apply tag filter + sort
  useEffect(() => {
    let list =
      selectedTags.length > 0
        ? allResults.filter((r) =>
            selectedTags.some((tag) => r.tags?.includes(tag))
          )
        : [...allResults];

    if (sortBy === 'duration') {
      list.sort((a, b) => a.duration_min - b.duration_min);
    } else if (sortBy === 'budget') {
      list.sort((a, b) => a.budget_min - b.budget_min);
    } else if (sortBy === 'stops') {
      list.sort((a, b) => b.stop_count - a.stop_count);
    }

    setFiltered(list);
  }, [selectedTags, sortBy, allResults]);

  const handleNewSearch = (newFrom, newTo) => {
    navigate(
      `/search?from=${encodeURIComponent(newFrom)}&to=${encodeURIComponent(newTo)}`
    );
  };

  return (
    <div className="search-page">
      <Navbar />

      {/* Search refine bar */}
      <div className="search-page__bar">
        <div className="search-page__bar-inner">
          <SearchBar
            initialFrom={from}
            initialTo={to}
            onSearch={handleNewSearch}
          />
        </div>
      </div>

      <div className="search-page__content">

        {/* Header */}
        <div className="search-page__header">
          <div>
            <h1 className="search-page__title">
              {from && to ? (
                <>
                  {from}
                  <span className="search-page__arrow"> → </span>
                  {to}
                </>
              ) : from || to ? (
                `Routes involving ${from || to}`
              ) : (
                'All Routes'
              )}
            </h1>
            {!loading && (
              <p className="search-page__count">
                {filtered.length} route{filtered.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="search-page__filters">
          <div className="search-page__tags">
            <TagFilterBar
              selectedTags={selectedTags}
              onFilterChange={setSelectedTags}
            />
          </div>
          <select
            className="search-page__sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="duration">Shortest Trip</option>
            <option value="budget">Budget Friendly</option>
            <option value="stops">Most Stops</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <Loader variant="card" count={3} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title={
              allResults.length === 0
                ? 'No routes found for this journey'
                : 'No routes match your filters'
            }
            subtitle={
              allResults.length === 0
                ? `We don't have a ${from} to ${to} route yet.`
                : 'Try removing some filters.'
            }
            actionLabel={
              allResults.length === 0 ? 'Browse All Routes' : 'Clear Filters'
            }
            onAction={() => {
              if (allResults.length === 0) navigate('/search');
              else setSelectedTags([]);
            }}
          />
        ) : (
          <div className="search-page__grid">
            {filtered.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;