import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Award, Calendar, CreditCard, Clock, ArrowRight, Gift } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const { currentUser, rewards, transactions, checkBirthdayReward, claimBirthdayReward } = useLoyalty();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return null;
  }
  
  // Check for birthday reward
  const { available: birthdayRewardAvailable, reward: birthdayReward } = checkBirthdayReward();
  
  // Filter transactions for this user
  const userTransactions = transactions
    .filter(transaction => transaction.customerId === currentUser.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  
  // Find next available reward
  const nextReward = rewards
    .filter(reward => reward.isActive && !reward.isBirthdayReward)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)
    .find(reward => reward.pointsRequired > currentUser.points);

  // Calculate progress percentage
  const progressPercentage = nextReward 
    ? Math.min(Math.round((currentUser.points / nextReward.pointsRequired) * 100), 100) 
    : 100;
    
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleClaimBirthdayReward = () => {
    const result = claimBirthdayReward();
    if (result.success) {
      // You could show a success message or modal here
      navigate('/redeem');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Hello, {currentUser.name}
        </h1>
        <p className="text-gray-600">
          Track your rewards and view your loyalty status
        </p>
      </div>

      {/* Birthday Reward Banner */}
      {birthdayRewardAvailable && birthdayReward && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                <Gift className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Happy Birthday!</h2>
                <p className="opacity-90">Your special birthday reward is waiting for you</p>
              </div>
            </div>
            <button
              onClick={handleClaimBirthdayReward}
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
            >
              Claim Now
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg shadow-md p-6 md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium mb-1">Current Balance</h2>
              <div className="text-3xl font-bold">
                {currentUser.points} Points
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Award className="h-8 w-8" />
            </div>
          </div>
          
          {nextReward && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to next reward</span>
                <span>{currentUser.points} / {nextReward.pointsRequired}</span>
              </div>
              
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mb-3">
                <div 
                  className="bg-white h-2.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">{nextReward.name}</span>
                  <span className="opacity-80"> ({nextReward.pointsRequired - currentUser.points} points to go)</span>
                </div>
                <button 
                  onClick={() => navigate('/redeem')}
                  className="bg-white text-amber-600 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  View Rewards
                  <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Visits</div>
                <div className="font-semibold">{currentUser.visits} visits</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <CreditCard className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Member Since</div>
                <div className="font-semibold">{formatDate(currentUser.registeredAt)}</div>
              </div>
            </div>
            
            {currentUser.lastVisit && (
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Visit</div>
                  <div className="font-semibold">{formatDate(currentUser.lastVisit)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        
        {userTransactions.length > 0 ? (
          <div className="space-y-4">
            {userTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center border-b border-gray-100 pb-4">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === 'earn' 
                    ? 'bg-green-100' 
                    : transaction.type === 'birthday'
                    ? 'bg-purple-100'
                    : 'bg-amber-100'
                }`}>
                  {transaction.type === 'earn' ? (
                    <CreditCard className="h-5 w-5 text-green-600" />
                  ) : transaction.type === 'birthday' ? (
                    <Gift className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Award className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">
                    {transaction.type === 'earn' 
                      ? `Receipt #${transaction.receiptNumber}`
                      : `Redeemed: ${transaction.rewardName}`
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
                
                <div className={`font-semibold ${
                  transaction.type === 'earn' 
                    ? 'text-green-600' 
                    : transaction.type === 'birthday'
                    ? 'text-purple-600'
                    : 'text-amber-600'
                }`}>
                  {transaction.type === 'earn' ? '+' : ''}{transaction.points} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No activity yet. Scan a receipt to start earning points!</p>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center mx-auto"
          >
            Scan New Receipt
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;