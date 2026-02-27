import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1B2042]">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs to complete onboarding
  if (!user.country || user.favorite_themes?.length === 0) {
    if (location.pathname !== '/welcome') {
      return <Navigate to="/welcome" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
