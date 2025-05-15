import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Award, PenSquare, Trash2, Plus, Save } from 'lucide-react';

const RewardSettings: React.FC = () => {
  const { rewards, updateReward, addReward, pointsPerDirham, updatePointsRate } = useLoyalty();
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsRequired: 100,
    category: 'food' as const,
    imageUrl: '',
    isActive: true,
  });
  const [rateValue, setRateValue] = useState(pointsPerDirham);
  
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setRateValue(value);
  };
  
  const saveRateChange = () => {
    updatePointsRate(rateValue);
  };
  
  const handleToggleRewardStatus = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      updateReward({
        ...reward,
        isActive: !reward.isActive,
      });
    }
  };
  
  const handleEditReward = (rewardId: string) => {
    setEditingReward(rewardId);
    setIsCreating(false);
  };
  
  const handleSaveEdit = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      updateReward(reward);
      setEditingReward(null);
    }
  };
  
  const handleUpdateRewardField = (rewardId: string, field: string, value: any) => {
    const updatedRewards = rewards.map(r => {
      if (r.id === rewardId) {
        return {
          ...r,
          [field]: field === 'pointsRequired' ? parseInt(value) : value,
        };
      }
      return r;
    });
    
    const updatedReward = updatedRewards.find(r => r.id === rewardId);
    if (updatedReward) {
      updateReward(updatedReward);
    }
  };
  
  const handleCreateReward = () => {
    addReward(newReward);
    setNewReward({
      name: '',
      description: '',
      pointsRequired: 100,
      category: 'food',
      imageUrl: '',
      isActive: true,
    });
    setIsCreating(false);
  };
  
  // Group rewards by category
  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, typeof rewards>);
  
  // Categories in display order
  const categoryOrder = ['food', 'drink', 'dessert', 'other'];
  const categoryNames = {
    food: 'Food Rewards',
    drink: 'Beverage Rewards',
    dessert: 'Dessert Rewards',
    other: 'Other Rewards'
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Reward Settings
        </h1>
        <p className="text-gray-600">
          Manage your loyalty program rewards and point calculations
        </p>
      </div>
      
      {/* Points Rate Setting */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Points Calculation
        </h2>
        
        <div className="max-w-md">
          <div className="mb-4">
            <label htmlFor="pointsRate" className="block text-sm font-medium text-gray-700 mb-1">
              Points earned per AED spent
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="pointsRate"
                min="0.1"
                step="0.1"
                value={rateValue}
                onChange={handleRateChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={saveRateChange}
                className="ml-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-300"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Example: At a rate of {rateValue}, a AED 100 bill will earn {Math.round(100 * rateValue)} points
            </p>
          </div>
        </div>
      </div>
      
      {/* Add New Reward Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Manage Rewards
        </h2>
        
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingReward(null);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Reward
        </button>
      </div>
      
      {/* New Reward Form */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Create New Reward
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">
                  Reward Name
                </label>
                <input
                  type="text"
                  id="newName"
                  value={newReward.name}
                  onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPoints" className="block text-sm font-medium text-gray-700 mb-1">
                  Points Required
                </label>
                <input
                  type="number"
                  id="newPoints"
                  min="1"
                  value={newReward.pointsRequired}
                  onChange={(e) => setNewReward({...newReward, pointsRequired: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="newCategory"
                  value={newReward.category}
                  onChange={(e) => setNewReward({...newReward, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="food">Food</option>
                  <option value="drink">Beverage</option>
                  <option value="dessert">Dessert</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="newImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  id="newImage"
                  value={newReward.imageUrl}
                  onChange={(e) => setNewReward({...newReward, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="newDescription"
                  value={newReward.description}
                  onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={5}
                  required
                />
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="newActive"
                  checked={newReward.isActive}
                  onChange={(e) => setNewReward({...newReward, isActive: e.target.checked})}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="newActive" className="ml-2 block text-sm text-gray-700">
                  Reward Active
                </label>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReward}
                  disabled={!newReward.name || !newReward.description || newReward.pointsRequired < 1}
                  className={`bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md flex items-center ${
                    !newReward.name || !newReward.description || newReward.pointsRequired < 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Reward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rewards Listing */}
      {categoryOrder.map(category => {
        const categoryRewards = groupedRewards[category];
        if (!categoryRewards || categoryRewards.length === 0) return null;
        
        return (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {categoryNames[category as keyof typeof categoryNames]}
            </h3>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryRewards.map(reward => (
                    <tr key={reward.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingReward === reward.id ? (
                          <div>
                            <input
                              type="text"
                              value={reward.name}
                              onChange={(e) => handleUpdateRewardField(reward.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md mb-2"
                            />
                            <textarea
                              value={reward.description}
                              onChange={(e) => handleUpdateRewardField(reward.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              rows={2}
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-gray-900">{reward.name}</div>
                            <div className="text-sm text-gray-500">{reward.description}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingReward === reward.id ? (
                          <input
                            type="number"
                            min="1"
                            value={reward.pointsRequired}
                            onChange={(e) => handleUpdateRewardField(reward.id, 'pointsRequired', e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {reward.pointsRequired} points
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reward.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {reward.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingReward === reward.id ? (
                          <button
                            onClick={() => handleSaveEdit(reward.id)}
                            className="text-teal-600 hover:text-teal-900 mr-3"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditReward(reward.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <PenSquare className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleRewardStatus(reward.id)}
                          className={`mr-3 ${
                            reward.isActive 
                              ? 'text-gray-600 hover:text-gray-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {reward.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RewardSettings;