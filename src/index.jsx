import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Find the target container in your HTML
const container = document.getElementById('root');

// Initialize the root layout using the new React 18 createRoot API
const root = createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
