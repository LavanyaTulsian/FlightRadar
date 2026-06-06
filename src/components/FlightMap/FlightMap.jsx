/**
 * FlightMap.jsx
 * Interactive world map using Leaflet directly.
 * - Renders aircraft as rotated SVG plane icons colour-coded by altitude
 * - Clicking an aircraft fires onSelectFlight
 * - Dark CartoDB tile layer to match the radar terminal aesthetic
 * - Custom map attribution and lifecycle handling
 */
import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import L from 'leaflet';
import './FlightMap.css';
import { getAltitudeColour, formatAltitude, formatSpeed, formatTimestamp } from '../../utils/flightHelpers';

/* ─── Tile layer config ──────────────────────────────────────── */
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CartoDB</a> | Data: <a href="https://opensky-network.org">OpenSky</a>';

/* ─── Aircraft SVG icon factory ──────────────────────────────── */
function createAircraftIcon(heading, colour, selected) {
  const size     = selected ? 24 : 18;
  const glow     = selected ? `drop-shadow(0 0 6px ${colour})` : 'none';
  const opacity  = selected ? 1 : 0.85;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg"
         style="transform:rotate(${heading}deg);filter:${glow};opacity:${opacity};">
      <path d="M12 2 L9 9 L2 11 L9 12.5 L8 22 L12 20 L16 22 L15 12.5 L22 11 L15 9 Z"
            fill="${colour}" stroke="${colour}" stroke-width="0.5"/>
    </svg>`;

  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function createGroundIcon() {
  const svg = `
    <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="4" fill="#888" stroke="#555" stroke-width="1"/>
    </svg>`;
  return L.divIcon({ className: '', html: svg, iconSize: [10, 10], iconAnchor: [5, 5] });
}

export default function FlightMap({ flights, selectedFlight, onSelectFlight }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

  const renderable = useMemo(
    () => flights.filter(f => f.latitude != null && f.longitude != null),
    [flights]
  );

  const getIcon = useCallback(
    (flight) => {
      if (flight.onGround) return createGroundIcon();
      const colour = getAltitudeColour(flight.altitude);
      const selected = selectedFlight?.icao24 === flight.icao24;
      return createAircraftIcon(flight.heading ?? 0, colour, selected);
    },
    [selectedFlight]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', () => onSelectFlight(null));
    mapRef.current = map;

    // Ensure the map size is recalculated after the container becomes visible,
    // especially on mobile/orientation changes.
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
    };
  }, [onSelectFlight]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current.clear();

    renderable.forEach((flight) => {
      const marker = L.marker([flight.latitude, flight.longitude], {
        icon: getIcon(flight),
      });

      marker.on('click', (event) => {
        event.originalEvent.stopPropagation();
        onSelectFlight(flight);
      });

      const popupContent = `
        <div class="popup-content">
          <p class="popup-callsign">${flight.callsign}</p>
          <p class="popup-meta">${flight.country} · ${flight.icao24.toUpperCase()}</p>
          <p class="popup-meta">${formatAltitude(flight.altitude)} · ${formatSpeed(flight.velocity)}</p>
          <p class="popup-meta">${flight.onGround ? 'Grounded' : 'Airborne'} · Last ${formatTimestamp(flight.lastContact)}</p>
          <p class="popup-hint">Click for full details</p>
        </div>`;

      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -14], autoPan: false });
      marker.addTo(map);
      markersRef.current.set(flight.icao24, marker);
    });

    return () => {
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current.clear();
    };
  }, [renderable, getIcon, onSelectFlight]);

  useEffect(() => {
    markersRef.current.forEach((marker, icao24) => {
      const flight = renderable.find(f => f.icao24 === icao24);
      if (!flight) return;
      marker.setIcon(getIcon(flight));

      if (selectedFlight?.icao24 === icao24) {
        marker.openPopup();
      } else {
        marker.closePopup();
      }
    });
  }, [selectedFlight, renderable, getIcon]);

  return (
    <div className="flight-map" role="region" aria-label="Live flight radar map">
      <div ref={mapContainerRef} className="flight-map__leaflet" />
    </div>
  );
}
