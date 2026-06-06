/**
 * StatCard.jsx
 * A compact stat tile used in the HUD strip above/below the map.
 * Accepts label, value, icon, and optional colour override.
 */
import React from 'react';
import './StatCard.css';

export default function StatCard({ label, value, icon, colour }) {
  return (
    <article
      className="stat-card"
      style={colour ? { '--stat-colour': colour } : undefined}
    >
      {icon && <span className="stat-card__icon" aria-hidden="true">{icon}</span>}
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
      </div>
    </article>
  );
}
