import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('https://forum-gen-backend-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // important for cookies / Passport sessions
        body: JSON.stringify({
          identifier: username, // or email if that's what your API expects
          password: password,
        }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }
  
      const data = await res.json();
      console.log('Login success:', data);
      
      // ← Store the token so future requests can use it:
      localStorage.setItem('token', data.accessToken);
      
      if (data.user?.role?.includes('admin')) {
        window.location.href = '/admin';
      } else {
        alert('You are not authorized to access the admin panel.');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
