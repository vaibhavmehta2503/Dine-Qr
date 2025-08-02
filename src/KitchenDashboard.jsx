import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/orders';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setOrderError('');
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    let restaurantId = urlParams.get('restaurant');
    if (!restaurantId) {
      const user = JSON.parse(localStorage.getItem('user'));
      restaurantId = user?.restaurantId;
    }
    if (!restaurantId) {
      setOrderError('No restaurant selected. Please scan a valid QR code or contact staff.');
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}?restaurantId=${restaurantId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (res.status === 403) {
        setOrderError('You do not have permission to view these orders. Please log in as staff or admin.');
        setOrders([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrderError(data.error || 'Failed to load orders.');
        setOrders([]);
      }
    } catch (err) {
      setOrderError('Failed to load orders.');
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl card-header mb-8 flex items-center gap-2">👨‍🍳 Kitchen Dashboard</h1>
      {orderError && <div className="text-red-600 text-center mb-4">{orderError}</div>}
      {loading ? <div>Loading...</div> : (
        <div>
          {orders.length === 0 ? <div>No orders found.</div> : (
            <ul>
              {orders.map(order => (
                <div className="card shadow-2xl p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl card-title flex items-center gap-1">🍽️ Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                      <p className="text-sm text-gray-600">Type: {order.orderType}</p>
                      <p className="text-sm text-gray-600">Table: {order.tableNumber}</p>
                      {order.deliveryAddress && (
                        <p className="text-sm text-gray-600">Address: {order.deliveryAddress}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`status-badge status-${order.status}`}>{order.status === 'completed' ? '✅' : order.status === 'ready' ? '🍽️' : order.status === 'preparing' ? '👨‍🍳' : '⏳'} {order.status}</span>
                    </div>
                  </div>
                  <div className="font-semibold text-[#e6c28b] mb-1 mt-2">Items:</div>
                  <ul className="ml-4 mb-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-[#234567]">{item.menuItem?.name || item.menuItem} x {item.quantity}</li>
                    ))}
                  </ul>
                  <div className="font-bold text-[#234567] mb-2">Total: ₹{order.total}</div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {['pending', 'preparing', 'ready', 'completed'].map(s => (
                      <button
                        key={s}
                        className={`btn-blue px-3 py-1 font-semibold shadow transition-all text-sm ${order.status === s ? 'opacity-70' : ''}`}
                        onClick={() => updateStatus(order._id, s)}
                        disabled={order.status === s}
                      >
                        {s === 'pending' ? '⏳' : s === 'preparing' ? '👨‍🍳' : s === 'ready' ? '🍽️' : '✅'} {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard; 