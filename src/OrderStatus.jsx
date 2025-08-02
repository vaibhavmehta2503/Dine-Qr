import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/orders';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setOrderError('');
      const token = localStorage.getItem('token');
      const urlParams = new URLSearchParams(window.location.search);
      let restaurantId = urlParams.get('restaurant');
      let tableNumber = urlParams.get('table');
      if (!restaurantId) {
        const user = JSON.parse(localStorage.getItem('user'));
        restaurantId = user?.restaurantId;
      }
      if (!tableNumber) {
        tableNumber = localStorage.getItem('qr_table');
      }
      if (!restaurantId) {
        setOrderError('No restaurant selected. Please scan a valid QR code or contact staff.');
        setOrders([]);
        setLoading(false);
        return;
      }
      let url = `${API_URL}?restaurantId=${restaurantId}`;
      if (tableNumber) url += `&tableNumber=${tableNumber}`;
      try {
        const res = await fetch(url, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (res.status === 403) {
          setOrderError('You do not have permission to view these orders.');
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
    fetchOrders();
  }, []);

  // Helper to generate a random time estimate
  const getRandomTime = () => Math.floor(Math.random() * 21) + 10; // 10-30 min

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card shadow-2xl p-8 mb-6">
        <h2 className="text-2xl card-header mb-4 flex items-center gap-2">🍽️ Order Status</h2>
      </div>

      {orderError && <div className="text-red-600 text-center mb-4">{orderError}</div>}

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-6 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-semibold text-[#e6c28b]">Order ID:</span>
                  <span className="font-mono text-[#234567]">{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Customer:</span>
                  <span className="text-gray-600">{order.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order Type:</span>
                  <span className="text-gray-600 capitalize">{order.orderType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Table/Location:</span>
                  <span className="text-gray-600">{order.tableNumber}</span>
                </div>
                {order.deliveryAddress && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Delivery Address:</span>
                    <span className="text-gray-600">{order.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-semibold" style={{color: 'var(--dineqr-gold)'}}>Status:</span>
                  <span className={`status-badge status-${order.status}`}>{order.status === 'completed' ? '✅' : order.status === 'ready' ? '🍽️' : order.status === 'preparing' ? '👨‍🍳' : '⏳'} {order.status}</span>
                  <span className="ml-auto text-sm text-[#2ecc71] font-semibold">Estimated: {getRandomTime()} min</span>
                </div>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-4 mt-2 list-disc text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.menuItem?.name || item.menuItem} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 font-bold text-blue-700">Total: ₹{order.total}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
