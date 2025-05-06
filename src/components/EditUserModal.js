import React, { useState, useEffect } from 'react';

export default function EditUserModal({ user, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    roles: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        roles: Array.isArray(user.roles) ? user.roles : [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'roles') {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(',').map((r) => r.trim()).filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Error: Invalid user ID');
      return;
    }
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `https://forum-gen-backend-production.up.railway.app/api/users/${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || 'Update failed');
      }
      const updatedUser = await res.json();
      onSave({ id: user.id, ...formData }); // Ensure id is included
      onClose();
    } catch (err) {
      alert('Error updating user: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Roles</label>
            <input
              type="text"
              name="roles"
              value={formData.roles.join(', ')}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter roles (e.g., admin, user)"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}