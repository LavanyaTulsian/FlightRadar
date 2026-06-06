/**
 * LoadingSpinner.jsx
 * Full-screen radar sweep animation shown while the first API request
 * is in-flight. Uses pure CSS for the rotating sweep effect.
 */
import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'ACQUIRING SIGNAL…' }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-radar">
        {/* Static rings */}
        <div className="loading-ring loading-ring--1" aria-hidden="true" />
        <div className="loading-ring loading-ring--2" aria-hidden="true" />
        <div className="loading-ring loading-ring--3" aria-hidden="true" />
        {/* Rotating sweep */}
        <div className="loading-sweep" aria-hidden="true" />
        {/* Centre dot */}
        <div className="loading-centre" aria-hidden="true" />
      </div>
      <p className="loading-label">{message}</p>
      <p className="loading-sub">OpenSky Network · Real-time ADS-B Data</p>
    </div>
  );
}
