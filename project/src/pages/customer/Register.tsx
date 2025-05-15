import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoyalty } from '../../context/LoyaltyContext';
import { User, Check } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useLoyalty();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      return;
    }
    
    setProcessing(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setProcessing(false);
    }, 1500);
  };
  
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      return;
    }
    
    setProcessing(true);
    
    // For MVP, any 4-digit code will work
    setTimeout(() => {
      if (otp.length === 4) {
        setOtpVerified(true);
        
        // Complete registration
        register({
          name,
          phone,
          email: email || undefined,
          birthdate: birthdate || undefined,
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
      
      setProcessing(false);
    }, 1500);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-600">
          Join our loyalty program to earn and redeem rewards
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {!otpSent ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification code to this number
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="birthdate" className="block text-gray-700 text-sm font-medium mb-1">
                Birth Date (Optional)
              </label>
              <input
                type="date"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get a special reward on your birthday!
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Sending Code...
                </>
              ) : (
                <>
                  <User className="mr-2 h-5 w-5" />
                  Continue
                </>
              )}
            </button>
          </form>
        ) : !otpVerified ? (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Verify Phone Number
              </h2>
              <p className="text-gray-600 mb-4">
                A 4-digit verification code has been sent to {phone}
              </p>
              
              <label htmlFor="otp" className="block text-gray-700 text-sm font-medium mb-1">
                Enter Verification Code
              </label>
              <input
                type="text"
                id="otp"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                For this demo, enter any 4 digits to proceed
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Verifying...
                </>
              ) : (
                "Verify & Create Account"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600">
              Redirecting to your dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;