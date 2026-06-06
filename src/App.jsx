/**
 * App.jsx
 * Root component — sets up React Router with four pages:
 *   /           → Map (live radar view)
 *   /flights    → Flights table (sortable / filterable)
 *   /statistics → Data visualisation with Recharts
 *   /about      → About the app & API attribution
 */
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar          from './components/Navbar/Navbar';
import MapPage         from './pages/MapPage/MapPage';
import FlightsPage     from './pages/FlightsPage/FlightsPage';
import StatisticsPage  from './pages/StatisticsPage/StatisticsPage';
import AboutPage       from './pages/AboutPage/AboutPage';

export default function App() {
  return (
    <HashRouter>
      {/* Persistent top-navigation bar */}
      <Navbar />

      <Routes>
        <Route path="/"            element={<MapPage />} />
        <Route path="/flights"     element={<FlightsPage />} />
        <Route path="/statistics"  element={<StatisticsPage />} />
        <Route path="/about"       element={<AboutPage />} />
        {/* Catch-all redirect */}
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
