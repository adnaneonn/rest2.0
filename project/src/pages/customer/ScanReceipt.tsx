import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Scan, ChevronRight, LogIn } from 'lucide-react';

const ScanReceipt: React.FC = () => {
  const { currentUser, login, loginAsOwner } = useLoyalty();
  const [phone, setPhone] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'customer' | 'owner'>('customer');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  
  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleScanReceipt = () => {
    // In a real implementation, this would open a QR scanner
    // For the MVP, we'll simulate a scanned receipt
    const mockReceiptId = `receipt-${Date.now()}`;
    navigate(`/validate/${mockReceiptId}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginMode === 'customer') {
      const success = login(phone);
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Phone number not found. Please register or try again.');
      }
    } else {
      const success = loginAsOwner(ownerPassword);
      if (success) {
        navigate('/owner');
      } else {
        setLoginError('Invalid owner password');
      }
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center my-8">
          <div className="bg-amber-500 p-6 rounded-full">
            <Scan className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Welcome to Dishtally
        </h1>
        <p className="text-gray-600 mb-6">
          Scan your receipt to earn rewards or log in to your account
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Scan Receipt QR Code
        </h2>
        <p className="text-gray-600 mb-4">
          Scan the QR code on your receipt to earn loyalty points and unlock rewards
        </p>
        <button
          onClick={handleScanReceipt}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
        >
          <Scan className="mr-2 h-5 w-5" />
          Scan Receipt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex mb-4">
          <button
            onClick={() => setLoginMode('customer')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              loginMode === 'customer'
                ? 'border-amber-500 text-amber-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => setLoginMode('owner')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              loginMode === 'owner'
                ? 'border-amber-500 text-amber-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Restaurant Owner
          </button>
        </div>

        {loginError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {loginMode === 'customer' ? (
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                Owner Password
              </label>
              <input
                type="password"
                id="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">For demo: use "owner123"</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 mb-3"
          >
            <LogIn className="mr-2 h-5 w-5" />
            {loginMode === 'customer' ? 'Customer Login' : 'Owner Login'}
          </button>

          {loginMode === 'customer' && (
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-300"
            >
              Register Now
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ScanReceipt;