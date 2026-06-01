import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // This tells it to use your App.js code

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);