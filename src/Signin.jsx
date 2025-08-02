import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Signin = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState({ name: '', address: '' });
  const [restaurantError, setRestaurantError] = useState('');
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // If admin and no restaurantId, show restaurant modal
        if (data.user.role === 'admin' && !data.user.restaurantId) {
          setPendingUser(data.user);
          setShowRestaurantModal(true);
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Sign in successful! Redirecting...');
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
        if (onLogin) onLogin(data.user);
      } else {
        setError(data.error || 'Sign in failed');
      }
    } catch {
      setError('Sign in failed. Please try again.');
    }
    setLoading(false);
  };

  // Handle restaurant creation
  const handleRestaurantCreate = async (e) => {
    e.preventDefault();
    setRestaurantError('');
    setRestaurantLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...restaurantForm, adminId: pendingUser.id }),
      });
      const data = await res.json();
      if (res.ok && data.restaurant && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowRestaurantModal(false);
        setSuccess('Restaurant added! Redirecting...');
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
        if (onLogin) onLogin(data.user);
      } else {
        setRestaurantError(data.error || 'Failed to add restaurant');
      }
    } catch {
      setRestaurantError('Failed to add restaurant. Please try again.');
    }
    setRestaurantLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf5] via-[#fff5ec] to-[#fde7db] flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col-reverse md:flex-row overflow-hidden">

        {/* Left Illustration */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="/images/image1.png"
            alt="Kitchen Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12">
          <img
            src="/images/image2.png"
            alt="DineQR Logo"
            className="h-24 w-auto mb-8"
          />

          <h2 className="text-3xl font-bold text-[#2ecc71] mb-2">Welcome back 👋</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to manage your kitchen & orders</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e74c3c] to-[#e6c28b] hover:from-[#e74c3c] hover:to-[#f7d774] text-white py-3 rounded-full font-semibold shadow-lg flex items-center justify-center gap-2 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-[#e6c28b] focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
          {success && <div className="text-green-600 mt-4 text-sm">{success}</div>}

          {/* Restaurant creation modal for admin with no restaurantId */}
          {showRestaurantModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <h3 className="text-xl font-bold mb-4 text-[#234567]">Add Your Restaurant</h3>
                <form onSubmit={handleRestaurantCreate} className="space-y-4">
                  <input
                    name="name"
                    value={restaurantForm.name}
                    onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    placeholder="Restaurant Name"
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-[#e6c28b] focus:ring-2 focus:outline-none"
                    required
                  />
                  <input
                    name="address"
                    value={restaurantForm.address}
                    onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                    placeholder="Restaurant Address"
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-[#e6c28b] focus:ring-2 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#e74c3c] to-[#e6c28b] hover:from-[#e74c3c] hover:to-[#f7d774] text-white py-3 rounded-full font-semibold shadow-lg transition-all text-lg focus:outline-none focus:ring-2 focus:ring-[#e6c28b] focus:ring-offset-2"
                    disabled={restaurantLoading}
                  >
                    {restaurantLoading ? 'Adding...' : 'Add Restaurant'}
                  </button>
                </form>
                {restaurantError && <div className="text-red-600 mt-4 text-sm">{restaurantError}</div>}
              </div>
            </div>
          )}

          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-[#e74c3c] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
