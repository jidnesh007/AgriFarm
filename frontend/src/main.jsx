import React from 'react';  // ✅ ADD THIS LINE
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <App />
    </React.Suspense>
  </React.StrictMode>
);
