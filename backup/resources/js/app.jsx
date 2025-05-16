import '../css/app.css';
// No need for bootstrap.js as we're not using Laravel's features

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import your pages
const Dashboard = React.lazy(() => import('./Pages/Dashboard'));
const Welcome = React.lazy(() => import('./Pages/Welcome'));
const Error = React.lazy(() => import('./Pages/Error'));

// Auth pages - adjust imports based on your actual file structure
const Login = React.lazy(() => import('./Pages/Auth/Login'));
const Register = React.lazy(() => import('./Pages/Auth/Register'));

const App = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </React.Suspense>
  );
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  }
});
