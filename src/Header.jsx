import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem('user'));
    setUser(userObj);
    setRole(userObj?.role || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header className="backdrop-blur-md bg-white/70 shadow-lg border-b border-[#e0e7ef] text-[#234567]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/images/image2.png" alt="DineQr Logo" className="w-10 h-10 rounded-full shadow mr-2" />
          <span className="text-2xl font-extrabold tracking-tight font-serif text-[#234567]">DineQR</span>
        </div>
        <nav className="flex gap-6 text-lg font-medium">
        <span
  className="hover:text-yellow-300 transition cursor-pointer"
  onClick={() => {
    const restaurantId = localStorage.getItem('qr_restaurant');
    const tableNumber = localStorage.getItem('qr_table');

    if (restaurantId && tableNumber) {
      navigate(`/menu?restaurant=${restaurantId}&table=${tableNumber}`);
    } else {
      navigate('/menu'); // fallback if QR is not scanned yet
    }
  }}
>
  Menu
</span>
<span
  className="hover:text-yellow-300 transition cursor-pointer"
  onClick={() => {
    const restaurantId = localStorage.getItem('qr_restaurant');
    const tableNumber = localStorage.getItem('qr_table');

    if (restaurantId && tableNumber) {
      navigate(`/order-status?restaurant=${restaurantId}&table=${tableNumber}`);
    } else {
      navigate('/order-status');
    }
  }}
>
  Orders
</span>

          {role === 'staff' || role === 'admin' ? (
            <>
              <Link className="hover:text-yellow-300 transition" to="/kitchen">Kitchen</Link>
              <Link className="hover:text-yellow-300 transition" to="/menuseller">Seller</Link>
              <Link className="hover:text-yellow-300 transition" to="/inventory-alerts">Inventory Alerts</Link>
              {role === 'admin' && <Link className="hover:text-yellow-300 transition" to="/qr-generator">QR Generator</Link>}
              {role === 'admin' && <Link className="hover:text-yellow-300 transition" to="/admin/roles">Manage Roles</Link>}
            </>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          {!role && <>
            <Link to="/signup" className="bg-gradient-to-r from-[#e74c3c] to-[#e6c28b] hover:from-[#e74c3c] hover:to-[#f7d774] text-white px-5 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 transition-all text-base focus:outline-none focus:ring-2 focus:ring-[#e6c28b] focus:ring-offset-2">
              Sign Up
            </Link>
            <Link to="/signin" className="bg-gradient-to-r from-[#e6c28b] to-[#e74c3c] hover:from-[#f7d774] hover:to-[#e74c3c] text-white px-5 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 transition-all text-base focus:outline-none focus:ring-2 focus:ring-[#e6c28b] focus:ring-offset-2">
              Sign In
            </Link>
          </>}
          {role && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="w-10 h-10 rounded-full bg-[#e0f7ef] flex items-center justify-center text-lg font-bold text-[#2ecc71] border-2 border-[#c3f0e8] focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                {user.name ? getInitials(user.name) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#2ecc71]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
                  </svg>
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-3 z-50 text-gray-800">
                  <div className="px-4 py-2 border-b">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 transition">Account</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-500">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 