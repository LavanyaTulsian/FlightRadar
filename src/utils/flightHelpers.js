/**
 * flightHelpers.js
 * Pure utility functions for formatting and deriving display values
 * from raw OpenSky flight data.
 */

// ─── Unit conversions ────────────────────────────────────────────────────────

/** Metres per second → knots */
export const msToKnots = (ms) => (ms != null ? Math.round(ms * 1.944) : 0);

/** Metres per second → km/h */
export const msToKmh = (ms) => (ms != null ? Math.round(ms * 3.6) : 0);

/** Metres → feet */
export const mToFt = (m) => (m != null ? Math.round(m * 3.28084) : 0);

/** Metres → flight level (FL) — FL is hundreds of feet */
export const mToFL = (m) => (m != null ? `FL${Math.round(m * 0.032808)}` : 'GND');

/** Format altitude with units */
export const formatAltitude = (m) => {
  if (!m || m <= 0) return 'Ground';
  const ft = mToFt(m);
  return ft >= 1000
    ? `${(ft / 1000).toFixed(1)}k ft`
    : `${ft} ft`;
};

/** Format speed with units */
export const formatSpeed = (ms) => {
  const kts = msToKnots(ms);
  return kts ? `${kts} kts` : '—';
};

/** Format vertical rate (climb / descent) */
export const formatVertRate = (ms) => {
  if (!ms || Math.abs(ms) < 0.5) return 'Level';
  const fpm = Math.round(ms * 196.85);
  return ms > 0 ? `+${fpm} fpm ▲` : `${fpm} fpm ▼`;
};

// ─── Colour helpers ───────────────────────────────────────────────────────────

/**
 * Returns a CSS colour string representing barometric altitude.
 * Matches the colour scheme used in professional ATC systems.
 */
export const getAltitudeColour = (m) => {
  if (!m || m <= 0)  return '#888888'; // ground / unknown
  if (m < 1_500)     return '#ff4757'; // very low  (< ~5,000 ft)
  if (m < 4_500)     return '#ffaa00'; // low       (< ~15,000 ft)
  if (m < 8_000)     return '#00d4ff'; // medium    (< ~26,000 ft)
  return '#00ff88';                    // cruising  (> ~26,000 ft)
};

/**
 * Returns a CSS colour representing ground speed.
 */
export const getSpeedColour = (ms) => {
  if (!ms || ms <= 0) return '#888888';
  if (ms < 100)       return '#ffaa00';
  if (ms < 200)       return '#00d4ff';
  return '#00ff88';
};

// ─── Country helpers ──────────────────────────────────────────────────────────

/** Minimal country → ISO-2 flag emoji lookup (top aviation nations) */
const COUNTRY_FLAGS = {
  'United States': '🇺🇸', 'Germany': '🇩🇪', 'United Kingdom': '🇬🇧',
  'France': '🇫🇷', 'Netherlands': '🇳🇱', 'China': '🇨🇳', 'Canada': '🇨🇦',
  'Australia': '🇦🇺', 'Japan': '🇯🇵', 'Spain': '🇪🇸', 'Italy': '🇮🇹',
  'Brazil': '🇧🇷', 'India': '🇮🇳', 'Russia': '🇷🇺', 'Turkey': '🇹🇷',
  'Mexico': '🇲🇽', 'South Korea': '🇰🇷', 'Singapore': '🇸🇬',
  'United Arab Emirates': '🇦🇪', 'Switzerland': '🇨🇭', 'Sweden': '🇸🇪',
  'Norway': '🇳🇴', 'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Poland': '🇵🇱',
  'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Portugal': '🇵🇹', 'Greece': '🇬🇷',
  'Indonesia': '🇮🇩', 'Thailand': '🇹🇭', 'Malaysia': '🇲🇾',
  'South Africa': '🇿🇦', 'Egypt': '🇪🇬', 'Argentina': '🇦🇷',
};

export const getCountryFlag = (country) => COUNTRY_FLAGS[country] ?? '🌐';

// ─── Time helpers ─────────────────────────────────────────────────────────────

/** Format Unix timestamp (seconds) as HH:MM:SS UTC */
export const formatTimestamp = (unix) => {
  if (!unix) return '—';
  return new Date(unix * 1000).toISOString().slice(11, 19) + ' UTC';
};

/** Human-readable elapsed time from a Date object */
export const timeAgo = (date) => {
  if (!date) return '—';
  const secs = Math.floor((Date.now() - date) / 1000);
  if (secs < 60)  return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

// ─── Statistics helpers ───────────────────────────────────────────────────────

/**
 * Returns top-N countries by aircraft count as
 * an array of { country, count, flag } sorted descending.
 */
export const topCountries = (flights, n = 10) => {
  const map = {};
  flights.forEach(f => {
    map[f.country] = (map[f.country] ?? 0) + 1;
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([country, count]) => ({ country, count, flag: getCountryFlag(country) }));
};

/**
 * Returns altitude histogram buckets for Recharts.
 * Bins: Ground, 0–5k ft, 5–15k ft, 15–25k ft, 25–35k ft, 35k+ ft
 */
export const altitudeBuckets = (flights) => {
  const buckets = [
    { label: 'Ground',   count: 0, min: -Infinity, max: 0 },
    { label: '0–5k ft',  count: 0, min: 0,   max: 1524 },
    { label: '5–15k ft', count: 0, min: 1524, max: 4572 },
    { label: '15–25k ft',count: 0, min: 4572, max: 7620 },
    { label: '25–35k ft',count: 0, min: 7620, max: 10668 },
    { label: '35k+ ft',  count: 0, min: 10668, max: Infinity },
  ];
  flights.forEach(f => {
    const alt = f.altitude ?? 0;
    const bucket = buckets.find(b => alt >= b.min && alt < b.max);
    if (bucket) bucket.count++;
  });
  return buckets;
};

/**
 * Returns speed histogram buckets for Recharts.
 * Bins in knots: 0–100, 100–200, 200–300, 300–400, 400–500, 500+ kts
 */
export const speedBuckets = (flights) => {
  const buckets = [
    { label: '0–100 kts',  count: 0, min: 0,   max: 51  },
    { label: '100–200 kts',count: 0, min: 51,   max: 103 },
    { label: '200–300 kts',count: 0, min: 103,  max: 154 },
    { label: '300–400 kts',count: 0, min: 154,  max: 206 },
    { label: '400–500 kts',count: 0, min: 206,  max: 257 },
    { label: '500+ kts',   count: 0, min: 257,  max: Infinity },
  ];
  flights.forEach(f => {
    const v = f.velocity ?? 0;
    const bucket = buckets.find(b => v >= b.min && v < b.max);
    if (bucket) bucket.count++;
  });
  return buckets;
};
