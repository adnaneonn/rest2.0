import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Award, Check, QrCode } from 'lucide-react';

const RedeemReward: React.FC = () => {
  const { currentUser, rewards, redeemReward } = useLoyalty();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  if (!currentUser) {
    return null;
  }
  
  // Filter active rewards
  const activeRewards = rewards.filter(reward => reward.isActive);
  
  const handleRedeemReward = (rewardId: string) => {
    setSelectedReward(rewardId);
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const result = redeemReward(rewardId);
      
      if (result.success) {
        setRedemptionCode(result.code);
      }
      
      setProcessing(false);
    }, 1500);
  };
  
  const handleCloseRedemption = () => {
    setSelectedReward(null);
    setRedemptionCode(null);
  };
  
  // Group rewards by category
  const groupedRewards = activeRewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, typeof activeRewards>);
  
  // Categories in display order
  const categoryOrder = ['food', 'drink', 'dessert', 'other'];
  const categoryNames = {
    food: 'Food Rewards',
    drink: 'Beverage Rewards',
    dessert: 'Dessert Rewards',
    other: 'Other Rewards'
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Redeem Rewards
        </h1>
        <p className="text-gray-600">
          Use your {currentUser.points} points to claim exclusive rewards
        </p>
      </div>
      
      {redemptionCode ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="bg-green-100 p-4 rounded-full inline-flex">
              <Check className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Reward Redeemed!
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="mb-4">
              <QrCode className="h-32 w-32 mx-auto" />
            </div>
            <div className="text-2xl font-bold tracking-wider mb-1">
              {redemptionCode}
            </div>
            <p className="text-gray-600">
              Show this code to the cashier to claim your reward
            </p>
          </div>
          
          <button
            onClick={handleCloseRedemption}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {categoryOrder.map(category => {
            const categoryRewards = groupedRewards[category];
            if (!categoryRewards || categoryRewards.length === 0) return null;
            
            return (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryRewards.map(reward => {
                    const isAffordable = currentUser.points >= reward.pointsRequired;
                    const isSelected = selectedReward === reward.id;
                    
                    return (
                      <div 
                        key={reward.id} 
                        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                          isSelected ? 'ring-2 ring-amber-500' : ''
                        }`}
                      >
                        {reward.imageUrl && (
                          <div className="h-40 w-full bg-gray-200 overflow-hidden">
                            <img 
                              src={reward.imageUrl} 
                              alt={reward.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {reward.name}
                            </h3>
                            <div className="bg-amber-100 text-amber-800 text-sm font-medium px-2 py-1 rounded">
                              {reward.pointsRequired} pts
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">
                            {reward.description}
                          </p>
                          
                          {isSelected && processing ? (
                            <button
                              className="w-full bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md flex items-center justify-center"
                              disabled
                            >
                              <span className="animate-spin mr-2">◌</span>
                              Processing...
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRedeemReward(reward.id)}
                              className={`w-full font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors ${
                                isAffordable 
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={!isAffordable}
                            >
                              {isAffordable ? (
                                <>
                                  <Award className="mr-2 h-4 w-4" />
                                  Redeem Reward
                                </>
                              ) : (
                                <>Not Enough Points</>
                              )}
                            </button>
                          )}
                          
                          {!isAffordable && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              You need {reward.pointsRequired - currentUser.points} more points
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default RedeemReward;