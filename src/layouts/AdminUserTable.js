<table className="min-w-full text-sm text-left border">
  <thead className="bg-gray-100 text-xs uppercase text-gray-500">
    <tr>
      <th className="p-3">Username</th>
      <th className="p-3">Email</th>
      <th className="p-3">Role</th>
      <th className="p-3 text-right">Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user) => (
      <tr key={user.id} className="border-t">
        <td className="p-3">{user.username}</td>
        <td className="p-3">{user.email}</td>
        <td className="p-3">{user.role}</td>
        <td className="p-3 text-right space-x-2">
          <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Edit</button>
          <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
