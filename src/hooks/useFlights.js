/**
 * useFlights.js
 * Custom hook that fetches live aircraft state vectors from the
 * OpenSky Network REST API and refreshes every 15 seconds.
 *
 * API docs: https://openskynetwork.github.io/opensky-api/rest.html
 * Endpoint: GET /api/states/all
 *
 * Each state vector array index maps to:
 *  [0]  icao24          — ICAO 24-bit transponder address
 *  [1]  callsign        — Aircraft callsign
 *  [2]  origin_country  — Country of origin
 *  [3]  time_position   — Unix timestamp of last position update
 *  [4]  last_contact    — Unix timestamp of last update
 *  [5]  longitude       — WGS-84 longitude (deg)
 *  [6]  latitude        — WGS-84 latitude  (deg)
 *  [7]  baro_altitude   — Barometric altitude (m)
 *  [8]  on_ground       — Boolean
 *  [9]  velocity        — Ground speed (m/s)
 *  [10] true_track      — True heading (deg, clockwise from North)
 *  [11] vertical_rate   — Vertical rate (m/s, positive = climbing)
 *  [14] squawk          — Transponder code
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_FLIGHTS } from '../utils/mockData';

const OPENSKY_URL      = 'https://opensky-network.org/api/states/all';
// Public CORS proxy fallback — used only when direct fetch fails in the browser
const CORS_PROXY       = 'https://api.allorigins.win/raw?url=';
const REFRESH_MS       = 15_000;   // 15 s — respects OpenSky anonymous rate limit
const MAX_DISPLAY      = 600;      // cap renders for performance

/**
 * Parse a raw OpenSky state-vector array into a clean flight object.
 * Returns null if lat/lon are missing (unusable for the map).
 */
function parseState(s) {
  if (s[5] === null || s[6] === null) return null;
  return {
    icao24:       s[0]  ?? 'unknown',
    callsign:     (s[1] ?? '').trim() || 'N/A',
    country:      s[2]  ?? 'Unknown',
    longitude:    s[5],
    latitude:     s[6],
    altitude:     s[7]  ?? 0,          // metres, barometric
    onGround:     s[8]  ?? false,
    velocity:     s[9]  ?? 0,          // m/s
    heading:      s[10] ?? 0,          // degrees true
    verticalRate: s[11] ?? 0,          // m/s
    squawk:       s[14] ?? '----',
    lastContact:  s[4]  ?? null,
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
    // Try the real API first. If it fails (commonly due to CORS in browsers),
    // attempt a one-time fallback via a public CORS proxy before using mock data.
    let triedProxy = false;
    try {
      const doFetch = async (url) => {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 12_000); // 12 s timeout
        try {
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        } finally {
          clearTimeout(timeout);
        }
      };

      let data;
      try {
        data = await doFetch(OPENSKY_URL);
      } catch (firstErr) {
        // If the direct fetch failed in the browser (network/CORS), try the proxy once
        console.warn('[useFlights] direct fetch failed, attempting proxy:', firstErr.message);
        triedProxy = true;
        const proxied = `${CORS_PROXY}${encodeURIComponent(OPENSKY_URL)}`;
        data = await doFetch(proxied);
      }

      console.log('useFlights: fetched data', data && { stateCount: Array.isArray(data.states) ? data.states.length : 0, triedProxy });
      if (!mountedRef.current) return;

      const states = Array.isArray(data?.states) ? data.states : [];

      // Parse, filter nulls, dedupe by icao24, and cap at MAX_DISPLAY
      const seen = new Set();
      const parsed = states
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

      // Fall back to mock data so the UI remains functional
      console.warn('[useFlights] API unavailable after proxy attempt, using mock data:', err.message);
      setFlights(MOCK_FLIGHTS);
      setError(err.message);
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
