import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/index.jsx';
import './styles/global.css';

/**
 * Primary React application entry point.
 * Bootstraps the root DOM node and injects the top-level Router provider configurations.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <AppRouter />
);
