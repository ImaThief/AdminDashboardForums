import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import SystemStatus from './pages/SystemStatus';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagementPage from './pages/UserManagementPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* /admin → Dashboard */}
            <Route index element={<AdminDashboard />} />
            {/* /admin/status → System Status */}
            <Route path="status" element={<SystemStatus />} />

            <Route path="users" element={<UserManagementPage />} />

          </Route>
        </Route>

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
