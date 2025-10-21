import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while loading
  if (loading) {
    return <div style={{ display: 'none' }}></div>; // Hidden loader
  }

  // Don't redirect if we're already on login page
  const isLoginPage = location.pathname === '/login';
  
  if (!user && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;