/**
 * StatisticsPage.jsx
 * Data visualisation dashboard using Recharts.
 * Charts:
 *  1. Bar chart   — Top 10 countries by aircraft count
 *  2. Pie chart   — Airborne vs on-ground breakdown
 *  3. Bar chart   — Altitude distribution histogram
 *  4. Bar chart   — Speed distribution histogram
 *  5. Stat summary cards at the top
 */
import React, { useMemo } from 'react';
import './StatisticsPage.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useFlights }  from '../../hooks/useFlights';
import LoadingSpinner  from '../../components/LoadingSpinner/LoadingSpinner';
import {
  topCountries, altitudeBuckets, speedBuckets,
  formatAltitude, formatSpeed, msToKnots,
} from '../../utils/flightHelpers';

/* ─── Recharts colour palette matching the radar theme ─────────*/
const CHART_ACCENT = '#00ff88';
const CHART_BLUE   = '#3d8fff';
const CHART_AMBER  = '#ffaa00';
const CHART_RED    = '#ff4757';

const PIE_COLOURS = [CHART_ACCENT, CHART_AMBER];

/* ─── Tooltip shared style ──────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

/* ─── Custom Pie label ───────────────────────────────────────── */
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return percent > 0.06 ? (
    <text
      x={x} y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontFamily="Share Tech Mono"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
}

/* ─── Main component ─────────────────────────────────────────── */
export default function StatisticsPage() {
  const { flights, loading, usingMock, totalCount, airborneCount, groundCount } = useFlights();

  /* Derived datasets */
  const countryData  = useMemo(() => topCountries(flights, 10), [flights]);
  const altData      = useMemo(() => altitudeBuckets(flights),   [flights]);
  const speedData    = useMemo(() => speedBuckets(flights),       [flights]);

  const pieData = [
    { name: 'Airborne', value: airborneCount },
    { name: 'On Ground', value: groundCount },
  ];

  /* Average altitude and speed of airborne flights */
  const airborne = flights.filter(f => !f.onGround && f.altitude > 0);
  const avgAlt   = airborne.length
    ? Math.round(airborne.reduce((s, f) => s + f.altitude, 0) / airborne.length)
    : 0;
  const avgSpeed = airborne.length
    ? Math.round(airborne.reduce((s, f) => s + (f.velocity ?? 0), 0) / airborne.length)
    : 0;
  const fastestFlight = flights.reduce(
    (best, f) => (f.velocity ?? 0) > (best?.velocity ?? 0) ? f : best, null
  );
  const highestFlight = flights.reduce(
    (best, f) => (f.altitude ?? 0) > (best?.altitude ?? 0) ? f : best, null
  );

  if (loading) {
    return (
      <main className="page-container stats-page" aria-label="Statistics">
        <div style={{ position: 'relative', flex: 1 }}>
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  return (
    <main className="page-container stats-page" aria-label="Flight statistics dashboard">

      {/* ── Page header ─────────────────────────────────────── */}
      <header className="stats-header animate-fade-in-up">
        <p className="section-label">Live Data Insights</p>
        <h1 className="display-h2">
          Traffic&nbsp;<span className="glow-text">Statistics</span>
        </h1>
        {usingMock && (
          <span className="data-badge" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}>
            ⚠ Demo data
          </span>
        )}
      </header>

      {/* ── Summary cards ────────────────────────────────────── */}
      <section className="stats-summary stagger animate-fade-in-up" aria-label="Summary statistics">
        {[
          { label: 'Total Tracked',  value: totalCount.toLocaleString(),                      colour: CHART_ACCENT },
          { label: 'Airborne',       value: airborneCount.toLocaleString(),                   colour: CHART_BLUE   },
          { label: 'Avg Altitude',   value: formatAltitude(avgAlt),                           colour: CHART_AMBER  },
          { label: 'Avg Speed',      value: `${msToKnots(avgSpeed)} kts`,                     colour: CHART_ACCENT },
          { label: 'Fastest',        value: fastestFlight ? fastestFlight.callsign : '—',     colour: CHART_RED    },
          { label: 'Highest',        value: highestFlight ? highestFlight.callsign : '—',     colour: CHART_BLUE   },
        ].map(({ label, value, colour }) => (
          <article key={label} className="stats-card" style={{ '--card-col': colour }}>
            <p className="stats-card__value">{value}</p>
            <p className="stats-card__label">{label}</p>
          </article>
        ))}
      </section>

      {/* ── Charts grid ──────────────────────────────────────── */}
      <div className="stats-grid">

        {/* Chart 1 — Top countries */}
        <section className="chart-card animate-fade-in-up" aria-label="Top countries chart" style={{ '--delay': '0.1s' }}>
          <h2 className="chart-card__title">Top Countries by Aircraft Count</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={countryData} margin={{ top: 8, right: 16, bottom: 40, left: 8 }}>
              <XAxis
                dataKey="country"
                tick={{ fill: '#6b9979', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                angle={-35}
                textAnchor="end"
                interval={0}
                stroke="transparent"
              />
              <YAxis
                tick={{ fill: '#6b9979', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                stroke="transparent"
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,255,136,0.04)' }} />
              <Bar dataKey="count" fill={CHART_ACCENT} radius={[3, 3, 0, 0]} name="Aircraft" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Chart 2 — Airborne vs ground pie */}
        <section className="chart-card animate-fade-in-up" aria-label="Airborne vs ground pie chart" style={{ '--delay': '0.15s' }}>
          <h2 className="chart-card__title">Airborne vs On Ground</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                labelLine={false}
                label={<PieLabel />}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLOURS[index]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [v.toLocaleString(), n]}
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'Share Tech Mono',
                  fontSize: 12,
                  color: 'var(--text-primary)',
                }}
              />
              <Legend
                formatter={v => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Share Tech Mono' }}>
                    {v}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* Chart 3 — Altitude distribution */}
        <section className="chart-card animate-fade-in-up" aria-label="Altitude distribution chart" style={{ '--delay': '0.2s' }}>
          <h2 className="chart-card__title">Altitude Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={altData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#6b9979', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                stroke="transparent"
              />
              <YAxis
                tick={{ fill: '#6b9979', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                stroke="transparent"
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.04)' }} />
              <Bar dataKey="count" fill={CHART_BLUE} radius={[3, 3, 0, 0]} name="Aircraft" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Chart 4 — Speed distribution */}
        <section className="chart-card animate-fade-in-up" aria-label="Speed distribution chart" style={{ '--delay': '0.25s' }}>
          <h2 className="chart-card__title">Speed Distribution (Knots)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={speedData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#6b9979', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                stroke="transparent"
              />
              <YAxis
                tick={{ fill: '#6b9979', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                stroke="transparent"
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,170,0,0.04)' }} />
              <Bar dataKey="count" fill={CHART_AMBER} radius={[3, 3, 0, 0]} name="Aircraft" />
            </BarChart>
          </ResponsiveContainer>
        </section>

      </div>

      {/* ── Data source note ─────────────────────────────────── */}
      <footer className="stats-footer">
        <p>
          Data sourced from the&nbsp;
          <a
            href="https://opensky-network.org"
            target="_blank"
            rel="noopener noreferrer"
            className="stats-link"
          >
            OpenSky Network
          </a>
          &nbsp;real-time ADS-B feed. Refreshes every 15 seconds.
          {' '}Showing up to 600 aircraft globally.
        </p>
      </footer>
    </main>
  );
}
