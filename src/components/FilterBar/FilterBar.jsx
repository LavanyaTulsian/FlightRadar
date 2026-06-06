/**
 * FilterBar.jsx
 * Search & filter controls displayed above the flights table.
 * Supports: text search (callsign/country), country select,
 * on-ground toggle, and altitude range slider.
 */
import React from 'react';
import './FilterBar.css';

export default function FilterBar({ filters, onChange, countries }) {
  const handle = (field) => (e) =>
    onChange({ ...filters, [field]: e.target.value });

  const handleCheckbox = (field) => (e) =>
    onChange({ ...filters, [field]: e.target.checked });

  return (
    <div className="filter-bar" role="search" aria-label="Flight filter controls">

      {/* Free-text search */}
      <div className="filter-bar__field filter-bar__field--search">
        <label htmlFor="fb-search" className="filter-bar__label">SEARCH</label>
        <div className="filter-bar__input-wrap">
          <span className="filter-bar__icon" aria-hidden="true">🔍</span>
          <input
            id="fb-search"
            type="search"
            className="filter-bar__input"
            placeholder="Callsign or country…"
            value={filters.query}
            onChange={handle('query')}
            aria-label="Search by callsign or country"
          />
        </div>
      </div>

      {/* Country select */}
      <div className="filter-bar__field">
        <label htmlFor="fb-country" className="filter-bar__label">COUNTRY</label>
        <select
          id="fb-country"
          className="filter-bar__select"
          value={filters.country}
          onChange={handle('country')}
          aria-label="Filter by country"
        >
          <option value="">All countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Min altitude */}
      <div className="filter-bar__field">
        <label htmlFor="fb-min-alt" className="filter-bar__label">
          MIN ALT&nbsp;<span className="filter-bar__unit">{filters.minAlt.toLocaleString()} m</span>
        </label>
        <input
          id="fb-min-alt"
          type="range"
          className="filter-bar__range"
          min={0}
          max={12000}
          step={500}
          value={filters.minAlt}
          onChange={handle('minAlt')}
          aria-label={`Minimum altitude ${filters.minAlt} metres`}
        />
      </div>

      {/* On-ground toggle */}
      <label className="filter-bar__toggle" htmlFor="fb-ground">
        <input
          id="fb-ground"
          type="checkbox"
          checked={filters.showGround}
          onChange={handleCheckbox('showGround')}
          aria-label="Show aircraft on the ground"
        />
        <span className="filter-bar__toggle-track" />
        <span className="filter-bar__toggle-label">SHOW GROUND</span>
      </label>

      {/* Reset */}
      <button
        className="filter-bar__reset"
        onClick={() => onChange({ query: '', country: '', minAlt: 0, showGround: true })}
        aria-label="Reset all filters"
      >
        RESET
      </button>

    </div>
  );
}
