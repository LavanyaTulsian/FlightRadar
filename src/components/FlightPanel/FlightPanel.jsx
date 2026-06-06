/**
 * FlightPanel.jsx
 * Animated right-side panel that slides in when a flight is selected.
 * Shows full detail: callsign, country, altitude, speed, heading,
 * vertical rate, squawk, on-ground status, and a visual altitude bar.
 */
import React from 'react';
import './FlightPanel.css';
import {
  formatAltitude, formatSpeed, formatVertRate,
  msToKnots, mToFL, getAltitudeColour, getCountryFlag,
  formatTimestamp,
} from '../../utils/flightHelpers';

/* ─── Sub-components ─────────────────────────────────────────── */

/** A single labelled data row inside the panel */
function DataRow({ label, value, accent }) {
  return (
    <div className="fp-data-row">
      <span className="fp-data-label">{label}</span>
      <span className={`fp-data-value ${accent ? 'fp-data-value--accent' : ''}`}>
        {value}
      </span>
    </div>
  );
}

/** Visual altitude bar showing position in 0–12,000 m range */
function AltBar({ altitude }) {
  const max  = 12500;
  const pct  = Math.min(((altitude ?? 0) / max) * 100, 100);
  const col  = getAltitudeColour(altitude);
  return (
    <div className="fp-alt-bar" aria-label={`Altitude ${formatAltitude(altitude)}`}>
      <div className="fp-alt-bar__track">
        <div
          className="fp-alt-bar__fill"
          style={{ height: `${pct}%`, background: col, boxShadow: `0 0 8px ${col}` }}
        />
      </div>
      <div className="fp-alt-bar__labels">
        <span>FL410</span>
        <span>FL000</span>
      </div>
    </div>
  );
}

/** Compass heading indicator */
function Compass({ heading }) {
  const cardinals = ['N','NE','E','SE','S','SW','W','NW'];
  const idx = Math.round((heading ?? 0) / 45) % 8;
  return (
    <div className="fp-compass" aria-label={`Heading ${heading} degrees`}>
      <div className="fp-compass__ring">
        <div
          className="fp-compass__needle"
          style={{ transform: `rotate(${heading ?? 0}deg)` }}
          aria-hidden="true"
        />
        <span className="fp-compass__deg">{Math.round(heading ?? 0)}°</span>
      </div>
      <span className="fp-compass__cardinal">{cardinals[idx]}</span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function FlightPanel({ flight, onClose }) {
  if (!flight) return null;

  const isAirborne = !flight.onGround;

  return (
    <aside
      className="flight-panel animate-slide-right"
      aria-label={`Flight details for ${flight.callsign}`}
      role="complementary"
    >
      {/* Header */}
      <header className="fp-header">
        <div>
          <p className="fp-callsign">{flight.callsign}</p>
          <p className="fp-country">
            <span aria-hidden="true">{getCountryFlag(flight.country)}</span>
            &nbsp;{flight.country}
          </p>
        </div>
        <button
          className="fp-close"
          onClick={onClose}
          aria-label="Close flight panel"
        >
          ✕
        </button>
      </header>

      {/* Status badge */}
      <div className="fp-status-bar">
        <span
          className={`status-dot ${isAirborne ? '' : 'off'}`}
          aria-hidden="true"
        />
        <span className="fp-status-text">
          {isAirborne ? 'AIRBORNE' : 'ON GROUND'}
        </span>
        <span className="fp-icao" title="ICAO 24-bit address">
          {flight.icao24.toUpperCase()}
        </span>
      </div>

      {/* Main data grid */}
      <div className="fp-body">
        {/* Visual instruments row */}
        <div className="fp-instruments">
          <AltBar altitude={flight.altitude} />
          <Compass heading={flight.heading} />
        </div>

        {/* Data rows */}
        <section className="fp-section" aria-label="Flight data">
          <DataRow label="ALTITUDE"  value={formatAltitude(flight.altitude)} accent />
          <DataRow label="FL"        value={mToFL(flight.altitude)} />
          <DataRow label="SPEED"     value={`${msToKnots(flight.velocity)} kts`} accent />
          <DataRow label="HEADING"   value={`${Math.round(flight.heading ?? 0)}°`} />
          <DataRow label="VERT RATE" value={formatVertRate(flight.verticalRate)} />
          <DataRow label="SQUAWK"    value={flight.squawk ?? '—'} />
        </section>

        {/* Position */}
        <section className="fp-section" aria-label="Position">
          <p className="fp-section-title">POSITION</p>
          <DataRow label="LAT" value={flight.latitude?.toFixed(4) + '°'} />
          <DataRow label="LON" value={flight.longitude?.toFixed(4) + '°'} />
        </section>
      </div>
    </aside>
  );
}
