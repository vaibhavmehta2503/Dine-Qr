import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/menu';
const ORDER_URL = 'http://localhost:5000/api/orders';

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [tableNumberInput, setTableNumberInput] = useState('');
  const [showTableNumberPrompt, setShowTableNumberPrompt] = useState(false);
  const [menuError, setMenuError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Predefined delivery addresses (like Zomato)
  const predefinedAddresses = [
    '123 Main Street, Downtown',
    '456 Oak Avenue, Midtown',
    '789 Pine Road, Uptown',
    '321 Elm Street, Westside',
    '654 Maple Drive, Eastside',
    '987 Cedar Lane, North District',
    '147 Birch Way, South District',
    '258 Spruce Court, Central Plaza'
  ];

  // Extract table number from URL or default to 'Takeaway'
  const urlParams = new URLSearchParams(window.location.search);
  const urlTableNumber = urlParams.get('table') || 'Table-1';
  
  // Set initial values from URL
  useEffect(() => {
    if (urlTableNumber) {
      // Table number is automatically set from QR code URL
    }
  }, [urlTableNumber]);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setMenuError('');
      const urlParams = new URLSearchParams(window.location.search);
      let restaurantId = urlParams.get('restaurant');
      let tableNumber = urlParams.get('table');
      // If params exist in URL, save to localStorage
      if (restaurantId) localStorage.setItem('qr_restaurant', restaurantId);
      if (tableNumber) localStorage.setItem('qr_table', tableNumber);
      // If missing, try to get from localStorage
      if (!restaurantId) restaurantId = localStorage.getItem('qr_restaurant');
      if (!tableNumber) tableNumber = localStorage.getItem('qr_table');
      if (!restaurantId) {
        const user = JSON.parse(localStorage.getItem('user'));
        restaurantId = user?.restaurantId;
      }
      if (!restaurantId) {
        setMenuError('No restaurant selected. Please scan a valid QR code or contact staff.');
        setMenuItems([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}?restaurantId=${restaurantId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMenuItems(data.filter(item => item.available));
      } else {
        setMenuError(data.error || 'Failed to load menu.');
        setMenuItems([]);
      }
      setLoading(false);
    };
    fetchMenu();
  }, [location.search]);

  // If not logged in, redirect to signin with redirect param
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      const params = new URLSearchParams(window.location.search);
      navigate(`/signin?redirect=${encodeURIComponent('/menu?' + params.toString())}`);
    }
  }, [navigate, location.search]);

  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(i => i._id === item._id);
      if (found) {
        return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    // Extract table number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table');
    if (!tableNumber) {
      // No table number, prompt for order type
      setPendingOrder({
        items: cart.map(i => ({ menuItem: i._id, quantity: i.qty })),
        total,
        customerName: 'Guest',
      });
      setShowOrderTypeModal(true);
      return;
    }
    // Table number present, auto-select dine-in
    await submitOrder({
      items: cart.map(i => ({ menuItem: i._id, quantity: i.qty })),
      total,
      customerName: 'Guest',
      tableNumber,
      orderType: 'dine-in',
    });
  };

  // Helper to submit order
  const submitOrder = async (order) => {
    setOrderStatus('Placing order...');
    try {
      const token = localStorage.getItem('token');
      const urlParams = new URLSearchParams(window.location.search);
      let restaurantId = urlParams.get('restaurant') || localStorage.getItem('qr_restaurant');
      if (!restaurantId) {
        setOrderStatus('No restaurant selected. Please scan a valid QR code or contact staff.');
        return;
      }
      const res = await fetch(ORDER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ ...order, restaurantId }),
      });
      if (res.ok) {
        setOrderStatus('Order placed successfully!');
        setCart([]);
        setShowOrderTypeModal(false);
        setPendingOrder(null);
      } else {
        const errorData = await res.json();
        console.error('Order placement failed:', errorData);
        setOrderStatus(`Failed to place order: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setOrderStatus('Failed to place order.');
    }
  };

  // Helper to handle Dine-in selection when no table number is present
  const handleDineInSelection = () => {
    setShowTableNumberPrompt(true);
    setShowOrderTypeModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#234567] font-serif flex items-center justify-center gap-2">🍽️ Our Menu</h1>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {menuError && <div className="text-red-600 text-center mb-4">{menuError}</div>}
          {menuItems.map(item => {
            const inCart = cart.find(i => i._id === item._id);
            return (
              <div key={item._id} className="card flex flex-col hover:shadow-2xl transition-all duration-200 p-0 group w-full max-w-xs mx-auto">
                {/* Image or placeholder */}
                <div className="relative w-full aspect-[4/3] bg-[#f5eee6] rounded-t-xl overflow-hidden flex items-center justify-center border-b border-[#e6c28b]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover rounded-t-xl transition-opacity duration-300" style={{ backgroundColor: '#f5eee6' }} onError={e => { e.target.style.opacity = 0; }} />
                  ) : (
                    <svg className="w-12 h-12 text-[#e6c28b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2m6.364 1.636l-1.414 1.414M21 12h-2M17.364 17.364l-1.414-1.414M12 21v-2M6.636 17.364l1.414-1.414M3 12h2M6.636 6.636l1.414 1.414" />
                    </svg>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base card-title flex items-center gap-1">🍲 {item.name}</h3>
                    <span className="text-base font-bold text-[#e6c28b]">₹{item.price}</span>
                  </div>
                  <hr className="my-1 border-[#f5eee6]" />
                  <p className="text-gray-600 mb-2 flex-1 text-sm">{item.description}</p>
                  {inCart ? (
                    <div className="flex items-center gap-2 mt-auto">
                      <button onClick={() => setCart(prev => prev.map(i => i._id === item._id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))} className="w-7 h-7 rounded-full bg-[#e6c28b] text-white font-bold flex items-center justify-center hover:bg-[#c9a76b] transition">-</button>
                      <span className="font-semibold text-[#234567] text-sm">{inCart.qty}</span>
                      <button onClick={() => setCart(prev => prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i))} className="w-7 h-7 rounded-full bg-[#e6c28b] text-white font-bold flex items-center justify-center hover:bg-[#c9a76b] transition">+</button>
                      <button onClick={() => removeFromCart(item._id)} className="ml-2 text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <button className="btn-gold px-4 py-1.5 mt-auto shadow-lg transition flex items-center justify-center gap-2 text-sm" onClick={() => addToCart(item)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="card p-8">
        <h2 className="text-2xl card-header mb-4 flex items-center gap-2">🛒 Cart</h2>
        {cart.length === 0 ? <div className="text-gray-500">No items in cart.</div> : (
          <ul className="divide-y divide-blue-100">
            {cart.map(item => (
              <li key={item._id} className="flex justify-between items-center py-2">
                <span className="font-medium">{item.name} x {item.qty}</span>
                <span className="text-blue-700 font-semibold">₹{item.price * item.qty}</span>
                <button className="text-red-600 ml-2 hover:underline" onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        <div className="font-bold mt-4 text-lg">Total: <span className="text-blue-900">₹{total}</span></div>
        <button
          className="btn-blue px-6 py-2 mt-4 shadow-lg transition"
          onClick={placeOrder}
          disabled={cart.length === 0}
        >
          Place Order
        </button>
        {orderStatus && <div className="mt-2 text-blue-700 font-semibold">{orderStatus}</div>}
      </div>
     
      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Select Delivery Location</h3>
                <button
                  onClick={() => setShowLocationPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Locations
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {predefinedAddresses.map((address, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDeliveryAddress(address);
                          setShowLocationPicker(false);
                        }}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">{address}</p>
                            <p className="text-sm text-gray-500">Estimated delivery: 25-35 min</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Address
                  </label>
                  <textarea
                    placeholder="Enter your custom delivery address..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    value={deliveryAddress}
                  />
                  <button
                    onClick={() => setShowLocationPicker(false)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Confirm Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOrderTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-[#234567]">Select Order Type</h3>
            <div className="flex flex-col gap-3">
              <button className="bg-gradient-to-r from-[#e6c28b] to-[#234567] text-white px-4 py-2 rounded-full font-semibold shadow hover:from-[#c9a76b] hover:to-[#123456] transition" onClick={handleDineInSelection}>Dine-in</button>
              <button className="bg-gradient-to-r from-[#e6c28b] to-[#234567] text-white px-4 py-2 rounded-full font-semibold shadow hover:from-[#c9a76b] hover:to-[#123456] transition" onClick={() => submitOrder({ ...pendingOrder, orderType: 'takeaway', tableNumber: 'Takeaway' })}>Takeaway</button>
              <button className="bg-gradient-to-r from-[#e6c28b] to-[#234567] text-white px-4 py-2 rounded-full font-semibold shadow hover:from-[#c9a76b] hover:to-[#123456] transition" onClick={() => submitOrder({ ...pendingOrder, orderType: 'delivery', tableNumber: 'Delivery', deliveryAddress })}>Delivery</button>
            </div>
            <button className="mt-6 text-sm text-gray-500 hover:underline" onClick={() => { setShowOrderTypeModal(false); setPendingOrder(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {showTableNumberPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-[#234567]">Enter Table Number</h3>
            <input
              type="text"
              placeholder="e.g. Table-5"
              value={tableNumberInput}
              onChange={e => setTableNumberInput(e.target.value)}
              className="w-full border border-[#e6c28b] rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#e6c28b]"
            />
            <button
              className="bg-gradient-to-r from-[#e6c28b] to-[#234567] text-white px-4 py-2 rounded-full font-semibold shadow hover:from-[#c9a76b] hover:to-[#123456] transition w-full"
              disabled={!tableNumberInput.trim()}
              onClick={() => {
                submitOrder({ ...pendingOrder, orderType: 'dine-in', tableNumber: tableNumberInput.trim() });
                setShowTableNumberPrompt(false);
                setPendingOrder(null);
                setTableNumberInput('');
              }}
            >
              Confirm Table
            </button>
            <button className="mt-4 text-sm text-gray-500 hover:underline w-full" onClick={() => { setShowTableNumberPrompt(false); setPendingOrder(null); setTableNumberInput(''); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu; 