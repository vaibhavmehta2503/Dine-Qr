import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem('user'));
    setUser(userObj);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setOrdersError('');
      try {
        let ordersData = [];
  
        // ✅ Authenticated User Orders
        if (user) {
          const token = localStorage.getItem('token');
          const restaurantId = user?.restaurantId;
          const res = await fetch(`/api/orders/my?restaurantId=${restaurantId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch orders');
          ordersData = await res.json();
        } 
        
        // ✅ QR-based Customer Orders
        else {
          const restaurantId = localStorage.getItem('qr_restaurant');
          const tableNumber = localStorage.getItem('qr_table');
          if (!restaurantId || !tableNumber) throw new Error('No order history found.');
          const res = await fetch(`/api/orders?restaurantId=${restaurantId}&tableNumber=${tableNumber}`);
          if (!res.ok) throw new Error('Failed to fetch guest orders');
          ordersData = await res.json();
        }
  
        setOrders(ordersData);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [user]);

  useEffect(() => {
    // Fetch all restaurants if superadmin
    if (user && user.role === 'superadmin') {
      fetch('/api/restaurants')
        .then(res => res.json())
        .then(setRestaurants);
    }
  }, [user]);

  const handleSetRestaurant = async () => {
    const token = localStorage.getItem('token');
    await fetch(`/api/auth/role/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: user.role, restaurantId: selectedRestaurant }),
    });
    window.location.reload();
  };
  
  const getInitials = name => name?.split(' ').map(n => n[0]).join('').toUpperCase();

  // Helper to generate a random time estimate
  const getRandomTime = () => Math.floor(Math.random() * 21) + 10; // 10-30 min

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-red-500 mb-2">Not Logged In</h2>
          <p className="text-gray-500 text-sm">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 👤 Profile Card */}
        <div className="card p-8 flex flex-col items-center text-center relative">
          <div className="w-28 h-28 rounded-full bg-[#e0f7ef] text-[#2ecc71] text-4xl font-bold flex items-center justify-center border-4 border-[#b2f0dd] mb-4 shadow-inner">
            {getInitials(user.name)}
          </div>
          <h2 className="text-3xl card-header flex items-center gap-2"><span role="img" aria-label="chef">👨‍🍳</span> {user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          {user.createdAt && (
            <p className="text-xs text-gray-400 mt-2">
              Joined on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
          {user.role === 'superadmin' && (
            <div className="mt-6 w-full">
              <label className="block mb-2 font-semibold">Assign Restaurant</label>
              <select
                value={selectedRestaurant}
                onChange={e => setSelectedRestaurant(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <button
                onClick={handleSetRestaurant}
                className="btn-gold px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-all"
                disabled={!selectedRestaurant}
              >
                Set Restaurant
              </button>
            </div>
          )}
        </div>

        {/* 📦 Order Timeline */}
        <div className="card p-6 md:p-8">
          <h3 className="text-2xl card-header mb-6 flex items-center gap-2">🍽️ Order History</h3>

          {loading ? (
            <div className="text-gray-500">Loading your orders...</div>
          ) : ordersError ? (
            <div className="text-red-500">{ordersError}</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">You haven't placed any orders yet.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="border-l-4 border-[#2ecc71] pl-4 relative group hover:bg-[#f8fefb] rounded-xl transition-all"
                >
                  <div className="absolute -left-2.5 top-2 w-4 h-4 bg-[#2ecc71] rounded-full border-2 border-white shadow"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-semibold text-gray-800">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-md text-[#e74c3c] font-bold">₹{order.total}</p>
                      <span className="text-xs bg-[#e6c28b] text-[#a97442] px-2 py-1 rounded-full capitalize border border-[#a97442]">
                        {order.status}
                      </span>
                      <div className="text-xs text-[#2ecc71] font-semibold mt-1">Estimated: {getRandomTime()} min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
