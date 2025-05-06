import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SystemStatus from './pages/SystemStatus';
import AdminLayout from './layouts/AdminLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Layout with nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="status" element={<SystemStatus />} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <h1 className="text-3xl font-bold text-blue-600">
                Tailwind is working!
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
