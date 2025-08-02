import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Signup successful! You can now sign in.');
        setForm({ name: '', email: '', password: '' });
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Signup failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf5] via-[#fff5ec] to-[#fde7db] flex justify-center items-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full grid md:grid-cols-2 overflow-hidden">
        
        {/* Left image (smaller and cleaner) */}
        <div className="hidden md:block">
          <img
            src="/images/image1.png"
            alt="Kitchen Basket"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Form section */}
        <div className="p-8 sm:p-10">
        <img
  src="/images/image2.png"
  alt="DineQR Logo"
  className="h-24 w-auto mb-8"
/>


          <h2 className="text-2xl font-bold text-[#2ecc71] mb-1">Create your account</h2>
          <p className="text-sm text-gray-500 mb-5">Join DineQR to manage your kitchen, menu & orders.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-[#2ecc71] focus:ring-2 focus:outline-none"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-[#2ecc71] focus:ring-2 focus:outline-none"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-[#2ecc71] focus:ring-2 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e74c3c] to-[#e6c28b] hover:from-[#e74c3c] hover:to-[#f7d774] text-white py-3 rounded-full font-semibold shadow-lg flex items-center justify-center gap-2 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-[#e6c28b] focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
          {success && <div className="text-green-600 mt-4 text-sm">{success}</div>}

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#e74c3c] font-medium hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
