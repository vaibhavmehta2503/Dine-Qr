import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerMenu from './CustomerMenu';
import OrderStatus from './OrderStatus';
import KitchenDashboard from './KitchenDashboard';
import ChatBotWidget from './ChatBotWidget';
import MenuSeller from './MenuSeller';
import Signup from './Signup';
import Signin from './Signin';
import Header from './Header';
import AdminRoleManager from './AdminRoleManager';
import Profile from './Profile';
import QRCodeGenerator from './QRCodeGenerator';
import InventoryExpiryAlerts from './InventoryExpiryAlerts';

const App = () => {
  return (
    <div className="min-h-screen">
      <Router>
        <Header />
        <ChatBotWidget />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CustomerMenu />} />
            <Route path="/menu" element={<CustomerMenu />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/menuseller" element={<MenuSeller />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/qr-generator" element={<QRCodeGenerator />} />
            <Route path="/inventory-alerts" element={<InventoryExpiryAlerts />} />
            <Route path="/admin/roles" element={<AdminRoleManager />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
