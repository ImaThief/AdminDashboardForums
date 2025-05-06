import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between p-4 h-screen sticky top-0">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-4">
            <Link to="/admin" className="block hover:text-blue-400">
              Dashboard
            </Link>
            <Link to="/admin/status" className="block hover:text-blue-400">
              System Status
            </Link>
            <Link to="/admin/users" className="block hover:text-blue-400">
              User Management
            </Link>
          </nav>
        </div>

        {/* Sign Out at bottom */}
        <button
          onClick={handleSignOut}
          className="text-left text-red-500 hover:text-red-400"
        >
          Sign Out
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
