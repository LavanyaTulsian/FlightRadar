/**
 * AboutPage.jsx
 * Informational page covering:
 *  - Project description
 *  - API attribution (OpenSky Network)
 *  - Technical stack
 *  - AI usage acknowledgement (academic integrity)
 *  - Data disclaimer
 */
import React from 'react';
import './AboutPage.css';

/* ─── Tech stack data ────────────────────────────────────────── */
const TECH_STACK = [
  { name: 'React 19',         role: 'UI Framework',         colour: '#61dafb' },
  { name: 'React Router v6',  role: 'Client-side routing',  colour: '#f44250' },
  { name: 'Leaflet',          role: 'Interactive maps',     colour: '#3d8fff' },
  { name: 'Recharts',         role: 'Data visualisation',   colour: '#ffaa00' },
  { name: 'Vite 8',           role: 'Build tool / dev server', colour: '#646cff' },
  { name: 'OpenSky Network',  role: 'Live ADS-B API',       colour: '#00ff88' },
  { name: 'CartoDB Tiles',    role: 'Dark map tiles',       colour: '#888' },
];

/* ─── FAQ / Info accordion item ─────────────────────────────── */
function InfoBlock({ q, children }) {
  return (
    <div className="about-info-block">
      <h3 className="about-info-q">{q}</h3>
      <div className="about-info-a">{children}</div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="page-container about-page" aria-label="About FlightScope">

      {/* ── Hero section ─────────────────────────────────────── */}
      <header className="about-hero animate-fade-in-up">
        <div className="about-hero__icon" aria-hidden="true">◉</div>
        <p className="section-label">FlightScope</p>
        <h1 className="display-h1">
          Real-time<br />
          <span className="glow-text">Air Traffic</span><br />
          Visualisation
        </h1>
        <p className="about-hero__sub">
          A live radar clone powered by the OpenSky Network ADS-B feed.
          Tracking hundreds of aircraft globally, updated every 15 seconds.
        </p>
      </header>

      {/* ── Info blocks ──────────────────────────────────────── */}
      <section className="about-content" aria-label="About the application">

        <div className="about-grid animate-fade-in-up">

          <div className="about-col">
            <InfoBlock q="What is FlightScope?">
              <p>
                FlightScope is a React-based frontend clone of flight-tracking
                platforms such as FlightRadar24. It consumes real-time ADS-B
                transponder data from the OpenSky Network and presents it
                through an interactive radar-style map, a sortable flights
                table, and a statistics dashboard.
              </p>
            </InfoBlock>

            <InfoBlock q="What is ADS-B?">
              <p>
                ADS-B (Automatic Dependent Surveillance — Broadcast) is a
                surveillance technology whereby aircraft broadcast their
                GPS position, altitude, speed, and identity automatically.
                Ground receivers and satellite networks collect these
                broadcasts and aggregate them into public databases.
              </p>
            </InfoBlock>

            <InfoBlock q="What data is shown?">
              <p>
                Each tracked aircraft provides: ICAO 24-bit identifier,
                callsign, country of registration, barometric altitude,
                ground speed (m/s → knots), true heading, vertical rate,
                GPS co-ordinates, on-ground status, and squawk code.
                Data accuracy depends on ADS-B receiver coverage.
              </p>
            </InfoBlock>

            <InfoBlock q="AI Usage Acknowledgement">
              <p>
                This project was developed with the assistance of an AI
                coding tool (Claude by Anthropic) used in a guided capacity
                for code structure, component architecture suggestions, and
                CSS styling. All design decisions, data integration logic,
                and final implementation reflect the developer's own
                understanding and choices. AI use is disclosed in compliance
                with academic integrity guidelines.
              </p>
            </InfoBlock>
          </div>

          {/* ── Tech stack ──────────────────────────────────── */}
          <aside className="about-stack" aria-label="Technology stack">
            <h2 className="about-stack__heading">Tech Stack</h2>
            <ul role="list">
              {TECH_STACK.map(({ name, role, colour }) => (
                <li key={name} className="about-stack-item">
                  <span
                    className="about-stack-dot"
                    style={{ background: colour, boxShadow: `0 0 8px ${colour}` }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="about-stack-name" style={{ color: colour }}>{name}</p>
                    <p className="about-stack-role">{role}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* API attribution */}
            <div className="about-api-card">
              <h3 className="about-api-card__title">Data Source</h3>
              <p className="about-api-card__body">
                Live flight data is provided by the&nbsp;
                <a
                  href="https://opensky-network.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link"
                  aria-label="OpenSky Network website (opens in new tab)"
                >
                  OpenSky Network
                </a>
                , a non-profit community-based receiver network providing
                open access to ADS-B flight data via a public REST API.
              </p>
              <p className="about-api-endpoint">
                GET https://opensky-network.org/api/states/all
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <footer className="about-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This application is a demonstration
          project for educational purposes. Flight data may be incomplete
          or delayed. Not suitable for real aviation navigation or
          operational use. Aircraft positions are approximate.
        </p>
      </footer>
    </main>
  );
}
