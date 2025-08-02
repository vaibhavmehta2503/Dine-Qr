import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/auth';

const AdminRoleManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user')); // Logged-in admin

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  const updateRole = async (id, role) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');

      // Send restaurantId only if assigning role = 'staff'
      const body = {
        role,
        ...(role === 'staff' && currentUser?.restaurantId && {
          restaurantId: currentUser.restaurantId,
        }),
      };

      const res = await fetch(`${API_URL}/role/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Role updated!');
        fetchUsers();
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch {
      setError('Failed to update role');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card shadow-2xl p-8 mb-6">
        <h2 className="text-2xl card-header mb-4 flex items-center gap-2">👨‍🍳 Admin Role Manager</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}

            <table className="min-w-full text-sm border-2 border-[#D4AF37] rounded-xl">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 font-semibold capitalize">{user.role}</td>
                    <td className="p-2">
                      {['admin', 'staff', 'customer'].map((r) => (
                        <button
                          key={r}
                          className={`px-2 py-1 rounded mr-2 ${
                            user.role === r
                              ? 'bg-blue-700 text-white'
                              : 'bg-gray-200 text-blue-900 hover:bg-blue-200'
                          }`}
                          disabled={user.role === r}
                          onClick={() => updateRole(user._id, r)}
                        >
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRoleManager;
