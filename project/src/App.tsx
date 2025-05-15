import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoyaltyProvider } from './context/LoyaltyContext';
import ScanReceipt from './pages/customer/ScanReceipt';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Register from './pages/customer/Register';
import ValidateReceipt from './pages/customer/ValidateReceipt';
import RedeemReward from './pages/customer/RedeemReward';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import CustomerList from './pages/owner/CustomerList';
import RewardSettings from './pages/owner/RewardSettings';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <LoyaltyProvider>
      <Router>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<ScanReceipt />} />
            <Route path="register" element={<Register />} />
            <Route path="validate/:receiptId" element={<ValidateReceipt />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="redeem" 
              element={
                <ProtectedRoute role="customer">
                  <RedeemReward />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Restaurant Owner Routes */}
          <Route path="/owner" element={<Layout isOwner />}>
            <Route 
              index 
              element={
                <ProtectedRoute role="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="customers" 
              element={
                <ProtectedRoute role="owner">
                  <CustomerList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="rewards" 
              element={
                <ProtectedRoute role="owner">
                  <RewardSettings />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </LoyaltyProvider>
  );
}

export default App;