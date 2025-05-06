import React, { useEffect, useState } from 'react';
import EditUserModal from '../components/EditUserModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://forum-gen-backend-production.up.railway.app/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    console.log('Deleting user id:', userId);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `https://forum-gen-backend-production.up.railway.app/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || 'Failed to delete user');
      }

      // Remove deleted user by `id`
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleSave = (updatedUser) => {
    console.log('Updated user returned from modal:', updatedUser);
    // Merge update by `id`
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {loading && <p className="text-gray-500">Loading users…</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <table className="min-w-full bg-white rounded shadow mt-4">
        <thead>
          <tr className="bg-gray-200 text-left text-sm">
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
              </td>
              <td className="p-3">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(updatedUser) => {
          handleSave(updatedUser);
          setEditingUser(null);
        }}
      />
    </div>
  );
}
