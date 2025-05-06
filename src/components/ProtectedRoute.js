import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) {
    // No token at all
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode payload to inspect roles
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.role || payload.roles || [];
    if (!roles.includes('admin')) {
      // Not an admin
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Malformed token
    return <Navigate to="/login" replace />;
  }

  // All good, render nested routes
  return <Outlet />;
}
