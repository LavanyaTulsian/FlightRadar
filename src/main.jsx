/* Entry point — must import Leaflet CSS before app styles */
import 'leaflet/dist/leaflet.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('main.jsx: mounting app');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Unable to mount React app: root element not found.');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
