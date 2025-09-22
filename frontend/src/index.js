import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';   // must point to your CSS
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);