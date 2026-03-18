import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import AppProviders from './context/AppProviders';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProviders>
        <App />
      </AppProviders>
    </HelmetProvider>
  </React.StrictMode>
);
