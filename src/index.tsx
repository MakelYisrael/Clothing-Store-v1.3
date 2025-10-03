// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Add your global styles here
import App from './App'; // Import the App component

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component into the root div in your HTML file
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
