import React, { useEffect, useState } from 'react';
import MenuItemForm from './MenuItemForm';
import MenuItemList from './MenuItemList';

const API_URL = 'http://localhost:5000/api/menu'; // Proxy or adjust as needed

const MenuSeller = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [error, setError] = useState("");

  // Fetch menu items
  const fetchMenu = async () => {
    setLoading(true);
    setError("");
    const user = JSON.parse(localStorage.getItem('user'));
    const restaurantId = user?.restaurantId;
    if (!restaurantId) {
      setMenuItems([]);
      setLoading(false);
      setError("No restaurant found. Please log in as an admin or staff.");
      return;
    }
    const res = await fetch(`${API_URL}?restaurantId=${restaurantId}`);
    const data = await res.json();
    setMenuItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Add or update menu item
  const handleSave = async (item) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const restaurantId = user?.restaurantId;
    const method = item._id ? 'PUT' : 'POST';
    const url = item._id ? `${API_URL}/${item._id}` : API_URL;
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ ...item, restaurantId }),
    });
    setEditItem(null);
    fetchMenu();
  };

  // Delete menu item
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    fetchMenu();
  };

  // Edit menu item
  const handleEdit = (item) => setEditItem(item);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf5] via-[#fff5ec] to-[#fde7db] flex flex-col items-center justify-start py-8 px-2">
      <div className="card shadow-2xl max-w-3xl w-full p-6 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">👨‍🍳</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight card-header">Seller Menu Management</h1>
        </div>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <MenuItemForm onSave={handleSave} editItem={editItem} onCancel={() => setEditItem(null)} />
        {loading ? (
          <div className="text-center py-8 text-lg text-gray-500">Loading...</div>
        ) : (
          <MenuItemList items={menuItems} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default MenuSeller; 