import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiresProfile = false }) => {
  const { isAuthenticated, isProfileLoaded, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If authentication is required but user is not authenticated
  if (!isAuthenticated) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If profile is required but not loaded
  if (requiresProfile && !isProfileLoaded) {
    // Redirect to complete profile page
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }
  
  // If all requirements are met, render the protected component
  return children;
};

export default ProtectedRoute;