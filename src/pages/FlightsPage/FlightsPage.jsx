/**
 * FlightsPage.jsx
 * Full-screen sortable, searchable, paginated table of all tracked
 * aircraft with per-row altitude and speed indicators.
 *
 * Features:
 *  - FilterBar: text search, country filter, altitude slider, ground toggle
 *  - Sortable columns (click header to toggle asc/desc)
 *  - Pagination (20 per page)
 *  - Row expansion showing extra data inline
 *  - Colour-coded altitude cell
 *  - Accessible table with correct ARIA roles
 */
import React, { useState, useMemo, useCallback } from 'react';
import './FlightsPage.css';
import { useFlights }    from '../../hooks/useFlights';
import FilterBar         from '../../components/FilterBar/FilterBar';
import LoadingSpinner    from '../../components/LoadingSpinner/LoadingSpinner';
import {
  formatAltitude, formatSpeed, formatVertRate,
  getAltitudeColour, getCountryFlag, mToFL,
} from '../../utils/flightHelpers';

const PAGE_SIZE = 20;

const COLUMNS = [
  { key: 'callsign',   label: 'CALLSIGN' },
  { key: 'country',    label: 'COUNTRY' },
  { key: 'altitude',   label: 'ALTITUDE' },
  { key: 'velocity',   label: 'SPEED' },
  { key: 'heading',    label: 'HDG' },
  { key: 'verticalRate', label: 'VERT RATE' },
  { key: 'squawk',     label: 'SQUAWK' },
  { key: 'onGround',   label: 'STATUS' },
];

/** Sort comparator for a given column key */
function compareBy(key, dir) {
  return (a, b) => {
    let av = a[key] ?? '', bv = b[key] ?? '';
    if (typeof av === 'boolean') av = av ? 1 : 0;
    if (typeof bv === 'boolean') bv = bv ? 1 : 0;
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ?  1 : -1;
    return 0;
  };
}

export default function FlightsPage() {
  const { flights, loading, error, usingMock, totalCount, airborneCount } = useFlights();

  /* Filter state */
  const [filters, setFilters] = useState({
    query: '', country: '', minAlt: 0, showGround: true,
  });

  /* Sort state */
  const [sort, setSort] = useState({ key: 'altitude', dir: 'desc' });

  /* Expanded row */
  const [expandedIcao, setExpandedIcao] = useState(null);

  /* Page */
  const [page, setPage] = useState(1);

  /* Unique sorted country list for dropdown */
  const countries = useMemo(
    () => [...new Set(flights.map(f => f.country))].sort(),
    [flights]
  );

  /* Apply filters then sort */
  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    return flights
      .filter(f => {
        if (!filters.showGround && f.onGround) return false;
        if (filters.country && f.country !== filters.country) return false;
        if ((f.altitude ?? 0) < Number(filters.minAlt)) return false;
        if (q && !f.callsign.toLowerCase().includes(q)
                && !f.country.toLowerCase().includes(q)
                && !f.icao24.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort(compareBy(sort.key, sort.dir));
  }, [flights, filters, sort]);

  /* Paginated slice */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* Column header click → sort */
  const handleSort = useCallback((key) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'desc' }
    );
    setPage(1);
  }, []);

  /* Filter change → reset to page 1 */
  const handleFilters = useCallback((f) => {
    setFilters(f);
    setPage(1);
  }, []);

  /* Row expand toggle */
  const toggleExpand = useCallback((icao24) => {
    setExpandedIcao(prev => prev === icao24 ? null : icao24);
  }, []);

  if (loading) {
    return (
      <main className="page-container flights-page" aria-label="Flights table">
        <div style={{ position: 'relative', flex: 1 }}>
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  return (
    <main className="page-container flights-page" aria-label="Flights table">

      {/* ── Page header ─────────────────────────────────────── */}
      <header className="flights-header animate-fade-in-up">
        <div>
          <p className="section-label">Live Traffic</p>
          <h1 className="display-h2">
            Flight&nbsp;<span className="glow-text">Directory</span>
          </h1>
        </div>
        <div className="flights-header__stats">
          <span className="data-badge">
            <span className="status-dot" aria-hidden="true" />
            {totalCount.toLocaleString()} tracked
          </span>
          <span className="data-badge" style={{ '--dot-col': 'var(--sky)' }}>
            ✈ {airborneCount.toLocaleString()} airborne
          </span>
          <span className="data-badge">
            ⟳ {filtered.length.toLocaleString()} shown
          </span>
        </div>
      </header>

      {/* ── Mock data notice ─────────────────────────────────── */}
      {usingMock && (
        <div className="flights-notice" role="alert">
          ⚠ OpenSky API unavailable — showing demo data.
        </div>
      )}

      {/* ── Filter bar ───────────────────────────────────────── */}
      <FilterBar filters={filters} onChange={handleFilters} countries={countries} />

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="flights-table-wrap">
        <table
          className="flights-table"
          aria-label="Tracked aircraft"
          role="table"
        >
          <thead>
            <tr role="row">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  role="columnheader"
                  aria-sort={
                    sort.key === col.key
                      ? sort.dir === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  className={`flights-th ${sort.key === col.key ? 'flights-th--active' : ''}`}
                  onClick={() => handleSort(col.key)}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleSort(col.key)}
                >
                  {col.label}
                  <span className="flights-th__sort" aria-hidden="true">
                    {sort.key === col.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                  </span>
                </th>
              ))}
              <th role="columnheader" className="flights-th">DETAILS</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="flights-empty" role="cell">
                  No aircraft match your filters.
                </td>
              </tr>
            ) : (
              pageItems.map(f => {
                const altColour   = getAltitudeColour(f.altitude);
                const isExpanded  = expandedIcao === f.icao24;

                return (
                  <React.Fragment key={f.icao24}>
                    <tr
                      className={`flights-row ${isExpanded ? 'flights-row--expanded' : ''}`}
                      role="row"
                    >
                      {/* Callsign */}
                      <td className="flights-td flights-td--callsign" role="cell">
                        <span className="flights-callsign">{f.callsign}</span>
                        <span className="flights-icao">{f.icao24}</span>
                      </td>

                      {/* Country */}
                      <td className="flights-td" role="cell">
                        <span aria-hidden="true">{getCountryFlag(f.country)}</span>
                        &nbsp;{f.country}
                      </td>

                      {/* Altitude */}
                      <td className="flights-td" role="cell">
                        <span style={{ color: altColour, textShadow: `0 0 6px ${altColour}` }}>
                          {formatAltitude(f.altitude)}
                        </span>
                      </td>

                      {/* Speed */}
                      <td className="flights-td" role="cell">{formatSpeed(f.velocity)}</td>

                      {/* Heading */}
                      <td className="flights-td" role="cell">
                        {Math.round(f.heading ?? 0)}°
                      </td>

                      {/* Vertical rate */}
                      <td className="flights-td" role="cell">
                        <span className={
                          f.verticalRate > 0.5  ? 'flights-climb'   :
                          f.verticalRate < -0.5 ? 'flights-descend' : ''
                        }>
                          {formatVertRate(f.verticalRate)}
                        </span>
                      </td>

                      {/* Squawk */}
                      <td className="flights-td flights-td--mono" role="cell">
                        {f.squawk ?? '—'}
                      </td>

                      {/* Status */}
                      <td className="flights-td" role="cell">
                        <span className={`flights-status ${f.onGround ? 'flights-status--ground' : ''}`}>
                          {f.onGround ? 'GROUND' : 'AIRBORNE'}
                        </span>
                      </td>

                      {/* Expand toggle */}
                      <td className="flights-td" role="cell">
                        <button
                          className="flights-expand-btn"
                          onClick={() => toggleExpand(f.icao24)}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${f.callsign}`}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {isExpanded && (
                      <tr className="flights-row-detail" role="row">
                        <td colSpan={COLUMNS.length + 1} role="cell">
                          <div className="flights-detail-body animate-fade-in">
                            <div className="flights-detail-grid">
                              <div>
                                <span className="flights-detail-label">ICAO24</span>
                                <span>{f.icao24.toUpperCase()}</span>
                              </div>
                              <div>
                                <span className="flights-detail-label">FLIGHT LEVEL</span>
                                <span>{mToFL(f.altitude)}</span>
                              </div>
                              <div>
                                <span className="flights-detail-label">LATITUDE</span>
                                <span>{f.latitude?.toFixed(5)}°</span>
                              </div>
                              <div>
                                <span className="flights-detail-label">LONGITUDE</span>
                                <span>{f.longitude?.toFixed(5)}°</span>
                              </div>
                              <div>
                                <span className="flights-detail-label">SQUAWK</span>
                                <span>{f.squawk ?? '—'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      <nav className="flights-pagination" aria-label="Table pagination">
        <button
          className="flights-pag-btn"
          onClick={() => setPage(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >«</button>
        <button
          className="flights-pag-btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >‹</button>

        <span className="flights-pag-info">
          Page {currentPage} of {totalPages}
          <span className="flights-pag-total">
            &nbsp;— {filtered.length} results
          </span>
        </span>

        <button
          className="flights-pag-btn"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >›</button>
        <button
          className="flights-pag-btn"
          onClick={() => setPage(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >»</button>
      </nav>
    </main>
  );
}
