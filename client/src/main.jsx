import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Make sure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
    <App />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found!');
  }
});
