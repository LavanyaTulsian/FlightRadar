/**
 * useFlights.js
 * Custom hook that fetches live aircraft data from the
 * AirLabs API and refreshes every 15 seconds.
 *
 * API docs: https://airlabs.co/docs/flights
 * Endpoint: GET https://airlabs.co/api/v9/flights?api_key=YOUR_KEY
 *
 * AirLabs response format:
 *  hex          — ICAO 24-bit transponder address (primary key)
 *  flight_iata  — IATA flight number
 *  flight_icao  — ICAO flight number
 *  lat          — WGS-84 latitude
 *  lng          — WGS-84 longitude
 *  alt          — Altitude in feet
 *  dir          — Heading in degrees
 *  speed        — Ground speed in knots
 *  v_speed      — Vertical speed in feet/minute
 *  dep_iata     — Departure airport IATA
 *  arr_iata     — Arrival airport IATA
 *  flag         — Country flag code
 *  aircraft_icao— Aircraft type ICAO code
 *  squawk       — Transponder code
 *  updated      — Unix timestamp of last update
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_FLIGHTS } from '../utils/mockData';

const AIRLABS_URL      = 'https://airlabs.co/api/v9/flights';
const REFRESH_MS       = 15_000;   // 15 s — respects rate limit
const MAX_DISPLAY      = 600;      // cap renders for performance

/**
 * Parse an AirLabs flight object into our standardized flight format.
 * Returns null if lat/lng are missing (unusable for the map).
 */
function parseState(flight) {
  if (flight.lat == null || flight.lng == null) return null;

  return {
    icao24:       flight.hex ?? 'unknown',
    callsign:     (flight.flight_iata || flight.flight_icao || '').trim() || 'N/A',
    country:      flight.flag ?? 'Unknown',
    longitude:    flight.lng,
    latitude:     flight.lat,
    altitude:     (flight.alt ?? 0) * 0.3048, // convert feet to metres for consistency
    onGround:     flight.alt === 0 || flight.alt == null,
    velocity:     (flight.speed ?? 0) * 0.51444, // convert knots to m/s
    heading:      flight.dir ?? 0,              // already in degrees
    verticalRate: (flight.v_speed ?? 0) * 0.00508, // convert ft/min to m/s
    squawk:       flight.squawk ?? '----',
    lastContact:  flight.updated ? flight.updated * 1000 : null, // convert to milliseconds
  };
}

export function useFlights() {
  const [flights, setFlights]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [usingMock, setUsingMock]       = useState(false);

  // Track whether the component is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true);

  const fetchFlights = useCallback(async () => {
    const apiKey = import.meta.env.VITE_AIRLABS_API_KEY;
    
    // If no API key is configured, use demo data
    if (!apiKey || apiKey === 'your_api_key_here') {
      if (!mountedRef.current) return;
      setFlights(MOCK_FLIGHTS);
      setError(null);
      setUsingMock(true);
      setLoading(false);
      console.info('[useFlights] Using sample data. Add your AirLabs API key to .env.local to enable live data.');
      return;
    }

    // Try to fetch real data from AirLabs
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12_000); // 12s timeout

      const url = `${AIRLABS_URL}?api_key=${apiKey}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`AirLabs API returned HTTP ${res.status}`);

      const data = await res.json();
      
      if (data.error) {
        throw new Error(`AirLabs error: ${data.error[0]?.message || 'Unknown error'}`);
      }

      console.log('useFlights: fetched AirLabs data', { flightCount: Array.isArray(data.response) ? data.response.length : 0 });
      if (!mountedRef.current) return;

      const flights = Array.isArray(data.response) ? data.response : [];

      // Parse, filter nulls, dedupe by icao24, and cap at MAX_DISPLAY
      const seen = new Set();
      const parsed = flights
        .map(parseState)
        .filter(Boolean)
        .filter(p => {
          if (seen.has(p.icao24)) return false;
          seen.add(p.icao24);
          return true;
        })
        .slice(0, MAX_DISPLAY);

      setFlights(parsed);
      setLastUpdated(new Date());
      setError(null);
      setUsingMock(false);
    } catch (err) {
      if (!mountedRef.current) return;

      // Fall back to demo data on any API error
      console.warn('[useFlights] AirLabs fetch failed, using sample data:', err.message);
      setFlights(MOCK_FLIGHTS);
      setError(null);
      setUsingMock(true);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchFlights();

    // Auto-refresh on interval
    const id = setInterval(fetchFlights, REFRESH_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchFlights]);

  return {
    flights,
    loading,
    error,
    lastUpdated,
    usingMock,
    refresh: fetchFlights,
    totalCount: flights.length,
    airborneCount: flights.filter(f => !f.onGround).length,
    groundCount:   flights.filter(f =>  f.onGround).length,
  };
}
