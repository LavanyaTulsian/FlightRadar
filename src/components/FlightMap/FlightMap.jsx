/**
 * FlightMap.jsx
 * Interactive world map using React-Leaflet.
 * - Renders aircraft as rotated SVG plane icons colour-coded by altitude
 * - Clicking an aircraft fires onSelectFlight
 * - Dark CartoDB tile layer to match the radar terminal aesthetic
 * - Custom map attribution
 */
import React, { useMemo, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import './FlightMap.css';
import { getAltitudeColour, formatAltitude, formatSpeed, msToKnots } from '../../utils/flightHelpers';

/* ─── Tile layer config ──────────────────────────────────────── */
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CartoDB</a> | Data: <a href="https://opensky-network.org">OpenSky</a>';

/* ─── Aircraft SVG icon factory ──────────────────────────────── */
/**
 * Generates a Leaflet DivIcon with an SVG aircraft shape.
 * @param {number} heading  - True heading in degrees (0 = North)
 * @param {string} colour   - Fill/stroke colour
 * @param {boolean} selected - Whether this flight is selected
 * @returns {L.DivIcon}
 */
function createAircraftIcon(heading, colour, selected) {
  const size     = selected ? 24 : 18;
  const glow     = selected ? `drop-shadow(0 0 6px ${colour})` : 'none';
  const opacity  = selected ? 1 : 0.85;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg"
         style="transform:rotate(${heading}deg);filter:${glow};opacity:${opacity};">
      <!-- Aircraft plan-view silhouette -->
      <path d="M12 2 L9 9 L2 11 L9 12.5 L8 22 L12 20 L16 22 L15 12.5 L22 11 L15 9 Z"
            fill="${colour}" stroke="${colour}" stroke-width="0.5"/>
    </svg>`;

  return L.divIcon({
    className:  '',
    html:       svg,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2 + 4)],
  });
}

/* Ground aircraft — use a small circle */
function createGroundIcon() {
  const svg = `
    <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="4" fill="#888" stroke="#555" stroke-width="1"/>
    </svg>`;
  return L.divIcon({ className: '', html: svg, iconSize: [10, 10], iconAnchor: [5, 5] });
}

/* ─── Click-outside deselect helper ────────────────────────────*/
function MapClickHandler({ onDeselect }) {
  useMapEvents({ click: () => onDeselect() });
  return null;
}

/* ─── Main component ─────────────────────────────────────────── */
export default function FlightMap({ flights, selectedFlight, onSelectFlight }) {

  // Memoize icon creation — only recalculate when selected flight changes
  const getIcon = useCallback(
    (flight) => {
      if (flight.onGround) return createGroundIcon();
      const colour   = getAltitudeColour(flight.altitude);
      const selected = selectedFlight?.icao24 === flight.icao24;
      return createAircraftIcon(flight.heading ?? 0, colour, selected);
    },
    [selectedFlight]
  );

  // Only show airborne + on-ground flights that have valid positions
  const renderable = useMemo(
    () => flights.filter(f => f.latitude && f.longitude),
    [flights]
  );

  return (
    <div className="flight-map" role="region" aria-label="Live flight radar map">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={12}
        className="flight-map__leaflet"
        zoomControl={true}
        attributionControl={true}
        preferCanvas={true}   /* performance for many markers */
      >
        {/* Dark-theme tile layer from CartoDB */}
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTR}
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Deselect on map background click */}
        <MapClickHandler onDeselect={() => onSelectFlight(null)} />

        {/* Render each aircraft as a positioned marker */}
        {renderable.map((flight) => (
          <Marker
            key={flight.icao24}
            position={[flight.latitude, flight.longitude]}
            icon={getIcon(flight)}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation();
                onSelectFlight(flight);
              },
            }}
            aria-label={`Aircraft ${flight.callsign}`}
          >
            {/* Minimal tooltip-style popup on hover */}
            <Popup closeButton={false} className="flight-map__popup">
              <div className="popup-content">
                <p className="popup-callsign">{flight.callsign}</p>
                <p className="popup-meta">{flight.country}</p>
                <p className="popup-meta">
                  {formatAltitude(flight.altitude)} · {formatSpeed(flight.velocity)}
                </p>
                <p className="popup-hint">Click for full details</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
