/**
 * Navbar.jsx
 * Persistent top navigation bar with:
 *  - Brand mark
 *  - Route links with active state
 *  - Live UTC clock
 *  - Hamburger menu for mobile
 *
 * Receives optional `flightCount` via context / props when used inside MapPage.
 */
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation }        from 'react-router-dom';
import './Navbar.css';
import { useFlights } from '../../hooks/useFlights';
import StatCard from '../StatCard/StatCard';

const NAV_LINKS = [
  { path: '/',            label: 'RADAR',      icon: '◎' },
  { path: '/flights',     label: 'FLIGHTS',    icon: '✈' },
  { path: '/statistics',  label: 'STATISTICS', icon: '▦' },
  { path: '/about',       label: 'ABOUT',      icon: '◈' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [utcTime,  setUtcTime]  = useState('');
  const location = useLocation();
  const { totalCount, airborneCount, groundCount } = useFlights();

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Live UTC clock updating every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh  = now.getUTCHours().toString().padStart(2, '0');
      const mm  = now.getUTCMinutes().toString().padStart(2, '0');
      const ss  = now.getUTCSeconds().toString().padStart(2, '0');
      setUtcTime(`${hh}:${mm}:${ss}Z`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">

        {/* Brand / logo */}
        <NavLink to="/" className="navbar__brand" aria-label="FlightRadar Home">
          <span className="navbar__brand-icon" aria-hidden="true">◉</span>
          <span className="navbar__brand-name">
            FLIGHT<span className="navbar__brand-accent">SCOPE</span>
          </span>
        </NavLink>

        {/* Desktop navigation */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__nav-list" role="list">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `navbar__nav-link ${isActive ? 'navbar__nav-link--active' : ''}`
                  }
                  aria-current={location.pathname === path ? 'page' : undefined}
                >
                  <span className="navbar__nav-icon" aria-hidden="true">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right-side utilities */}
        <div className="navbar__right">
          <time className="navbar__clock" dateTime={new Date().toISOString()} aria-label="Current UTC time">
            {utcTime}
          </time>

          {/* Hamburger toggle (mobile only) */}
          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="navbar__mobile-menu animate-fade-in"
          aria-label="Mobile navigation"
        >
          {/* Live stats shown in the mobile dropdown for compact screens */}
          <div className="navbar__mobile-stats">
            <div className="navbar__mobile-stats-inner">
              <StatCard label="TOTAL" value={totalCount.toLocaleString()} icon="◎" colour="var(--accent)" />
              <StatCard label="AIRBORNE" value={airborneCount.toLocaleString()} icon="✈" colour="var(--sky)" />
              <StatCard label="GROUND" value={groundCount.toLocaleString()} icon="▼" colour="var(--amber)" />
            </div>
          </div>

          <ul role="list">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
