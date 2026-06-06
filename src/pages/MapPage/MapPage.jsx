/**
 * MapPage.jsx
 * Primary page: full-screen live radar map.
 * Layout:
 *  - HUD stats strip (top, always visible)
 *  - Interactive FlightMap (fills remaining height)
 *  - FlightPanel slides in from right when an aircraft is selected
 *  - API error/mock-data notice banner
 */
import React, { useState, useMemo } from 'react';
import './MapPage.css';
import { useFlights }        from '../../hooks/useFlights';
import FlightMap             from '../../components/FlightMap/FlightMap';
import FlightPanel           from '../../components/FlightPanel/FlightPanel';
import LoadingSpinner        from '../../components/LoadingSpinner/LoadingSpinner';
import StatCard              from '../../components/StatCard/StatCard';
import { timeAgo }           from '../../utils/flightHelpers';

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('MapErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="map-error" role="alert">
          <p>Unable to render the interactive map.</p>
          <pre>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MapPage() {
  const {
    flights, loading, error, lastUpdated,
    usingMock, refresh, totalCount, airborneCount, groundCount,
  } = useFlights();

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showOnlyAirborne, setShowOnlyAirborne] = useState(false);

  console.log('MapPage render', {
    loading,
    flights: flights.length,
    error,
    usingMock,
    selectedFlight: selectedFlight?.icao24 ?? null,
  });

  // Filtered flights for the map
  const displayFlights = useMemo(
    () => showOnlyAirborne ? flights.filter(f => !f.onGround) : flights,
    [flights, showOnlyAirborne]
  );

  // Most common country for display in HUD
  const topCountry = useMemo(() => {
    if (!flights.length) return '—';
    const counts = {};
    flights.forEach(f => { counts[f.country] = (counts[f.country] ?? 0) + 1; });
    return Object.entries(counts).sort(([,a],[,b]) => b - a)[0]?.[0] ?? '—';
  }, [flights]);

  return (
    <main className="page-container map-page" aria-label="Live Radar Map">

      {/* ── HUD Stats Strip ──────────────────────────────────── */}
      <section className="map-hud" aria-label="Live flight statistics">
        <div className="map-hud__cards stagger">
          <StatCard
            label="TOTAL TRACKED"
            value={totalCount.toLocaleString()}
            icon="◎"
            colour="var(--accent)"
          />
          <StatCard
            label="AIRBORNE"
            value={airborneCount.toLocaleString()}
            icon="✈"
            colour="var(--sky)"
          />
          <StatCard
            label="ON GROUND"
            value={groundCount.toLocaleString()}
            icon="▼"
            colour="var(--amber)"
          />
          <StatCard
            label="TOP ORIGIN"
            value={topCountry}
            icon="🌍"
            colour="var(--blue)"
          />
        </div>

        <div className="map-hud__right">
          {/* Airborne-only toggle */}
          <label className="map-hud__toggle" htmlFor="airborne-toggle">
            <input
              id="airborne-toggle"
              type="checkbox"
              checked={showOnlyAirborne}
              onChange={e => setShowOnlyAirborne(e.target.checked)}
              aria-label="Show airborne aircraft only"
            />
            <span className="map-hud__toggle-track" />
            <span>AIRBORNE ONLY</span>
          </label>

          {/* Refresh button + last-update time */}
          <button
            className="map-hud__refresh"
            onClick={refresh}
            aria-label="Refresh flight data"
          >
            ↻ REFRESH
          </button>
          <span className="map-hud__updated" aria-live="polite">
            {lastUpdated ? `Updated ${timeAgo(lastUpdated)}` : 'Fetching…'}
          </span>
        </div>
      </section>

      {/* ── Error / Mock-data notice ──────────────────────────── */}
      {(error || usingMock) && (
        <div
          className="map-notice"
          role="alert"
          aria-live="assertive"
        >
          <span>⚠</span>
          <span>
            {usingMock
              ? 'OpenSky API unavailable — showing demo data. '
              : `API error: ${error}. `}
            Live data refreshes automatically.
          </span>
        </div>
      )}

      {/* ── Map area ─────────────────────────────────────────── */}
      <div className="map-stage">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <MapErrorBoundary>
            <FlightMap
              flights={displayFlights}
              selectedFlight={selectedFlight}
              onSelectFlight={setSelectedFlight}
            />
            {selectedFlight && (
              <FlightPanel
                flight={selectedFlight}
                onClose={() => setSelectedFlight(null)}
              />
            )}
          </MapErrorBoundary>
        )}

        {/* Map legend */}
        <aside className="map-legend" aria-label="Altitude colour legend">
          <p className="map-legend__title">ALTITUDE</p>
          {[
            { col: '#ff4757', label: '< 5,000 ft' },
            { col: '#ffaa00', label: '5–15k ft' },
            { col: '#00d4ff', label: '15–26k ft' },
            { col: '#00ff88', label: '> 26k ft' },
            { col: '#888888', label: 'Ground' },
          ].map(({ col, label }) => (
            <div key={label} className="map-legend__row">
              <span
                className="map-legend__swatch"
                style={{ background: col, boxShadow: `0 0 6px ${col}` }}
                aria-hidden="true"
              />
              <span>{label}</span>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
