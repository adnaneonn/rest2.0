import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Receipt, CheckCircle, AlertCircle } from 'lucide-react';

const ValidateReceipt: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  const { currentUser, validateReceipt } = useLoyalty();
  const navigate = useNavigate();
  
  const [receiptNumber, setReceiptNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; points: number } | null>(null);
  
  // Initialize with today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    setDate(formattedDate);
    
    // Prefill receipt number if available from the route
    if (receiptId) {
      setReceiptNumber(receiptId.replace('receipt-', ''));
    }
  }, [receiptId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate a short delay as if validating with server
    setTimeout(() => {
      try {
        const amountValue = parseFloat(amount);
        
        const validateResult = validateReceipt({
          receiptNumber,
          amount: amountValue,
          date,
        });
        
        setResult(validateResult);
        setProcessing(false);
        
        // If successful and user is logged in, redirect to dashboard after a short delay
        if (validateResult.success && currentUser) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else if (validateResult.success && !currentUser) {
          // If successful but user is not logged in, redirect to registration
          setTimeout(() => {
            navigate('/register');
          }, 2000);
        }
      } catch (error) {
        setResult({ success: false, points: 0 });
        setProcessing(false);
      }
    }, 1500);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Validate Your Receipt
        </h1>
        <p className="text-gray-600">
          Please enter your receipt details to earn points
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {result === null ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="receiptNumber" className="block text-gray-700 text-sm font-medium mb-1">
                Receipt Number
              </label>
              <input
                type="text"
                id="receiptNumber"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700 text-sm font-medium mb-1">
                Bill Amount (AED)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                min="1"
                step="0.01"
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-1">
                Receipt Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Validating...
                </>
              ) : (
                <>
                  <Receipt className="mr-2 h-5 w-5" />
                  Validate Receipt
                </>
              )}
            </button>
          </form>
        ) : result.success ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Receipt Validated!
            </h2>
            <div className="bg-amber-50 p-4 rounded-lg mb-4">
              <p className="text-amber-800 font-medium text-lg">
                You've earned {result.points} points!
              </p>
              {currentUser && (
                <p className="text-gray-600 mt-1">
                  New balance: {currentUser.points + result.points} points
                </p>
              )}
            </div>
            {!currentUser && (
              <p className="text-gray-600 mb-4">
                Register or login to save your points and redeem rewards!
              </p>
            )}
            <button
              onClick={() => currentUser ? navigate('/dashboard') : navigate('/register')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md"
            >
              {currentUser ? 'View My Dashboard' : 'Register Now'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Validation Failed
            </h2>
            <p className="text-gray-600 mb-4">
              This receipt could not be validated. It may have already been used or contains invalid information.
            </p>
            <button
              onClick={() => setResult(null)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidateReceipt;