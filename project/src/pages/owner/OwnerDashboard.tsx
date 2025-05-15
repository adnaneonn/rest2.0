import React, { useMemo } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Users, Award, CreditCard, TrendingUp, Calendar, Clock } from 'lucide-react';

const OwnerDashboard: React.FC = () => {
  const { customers, transactions, rewards } = useLoyalty();
  
  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const recent7DaysEarnTransactions = transactions.filter(t => 
      t.type === 'earn' && 
      new Date(t.timestamp) >= sevenDaysAgo
    );
    
    const recent30DaysEarnTransactions = transactions.filter(t => 
      t.type === 'earn' && 
      new Date(t.timestamp) >= thirtyDaysAgo
    );
    
    const recentRedemptions = transactions.filter(t => 
      t.type === 'redeem' && 
      new Date(t.timestamp) >= thirtyDaysAgo
    );
    
    return {
      totalCustomers: customers.length,
      activeRewards: rewards.filter(r => r.isActive).length,
      totalPoints: customers.reduce((sum, c) => sum + c.points, 0),
      last7Days: {
        transactions: recent7DaysEarnTransactions.length,
        revenue: recent7DaysEarnTransactions.reduce((sum, t) => sum + t.amount, 0),
        averageBill: recent7DaysEarnTransactions.length > 0 
          ? recent7DaysEarnTransactions.reduce((sum, t) => sum + t.amount, 0) / recent7DaysEarnTransactions.length 
          : 0,
      },
      last30Days: {
        transactions: recent30DaysEarnTransactions.length,
        revenue: recent30DaysEarnTransactions.reduce((sum, t) => sum + t.amount, 0),
        redemptions: recentRedemptions.length,
      },
    };
  }, [customers, transactions, rewards]);
  
  // Top customers by spend
  const topCustomers = useMemo(() => {
    const customerSpend = customers.map(customer => {
      const customerTransactions = transactions.filter(t => 
        t.customerId === customer.id && 
        t.type === 'earn'
      );
      
      const totalSpend = customerTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...customer,
        totalSpend,
        transactionCount: customerTransactions.length,
      };
    });
    
    return customerSpend
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5);
  }, [customers, transactions]);
  
  // Recent transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [transactions]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `AED ${amount.toFixed(2)}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Restaurant Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your loyalty program performance
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Total Customers</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats.totalCustomers}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Active Rewards</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats.activeRewards}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">30-Day Revenue</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {formatCurrency(stats.last30Days.revenue)}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Total Points</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats.totalPoints}
          </div>
        </div>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">7-Day Performance</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="text-gray-600">Transactions</div>
              <div className="font-medium">{stats.last7Days.transactions}</div>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="text-gray-600">Revenue</div>
              <div className="font-medium">{formatCurrency(stats.last7Days.revenue)}</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-gray-600">Average Bill</div>
              <div className="font-medium">{formatCurrency(stats.last7Days.averageBill)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">30-Day Performance</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="text-gray-600">Transactions</div>
              <div className="font-medium">{stats.last30Days.transactions}</div>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="text-gray-600">Revenue</div>
              <div className="font-medium">{formatCurrency(stats.last30Days.revenue)}</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-gray-600">Reward Redemptions</div>
              <div className="font-medium">{stats.last30Days.redemptions}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Customers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Customers</h2>
          
          {topCustomers.length > 0 ? (
            <div className="space-y-4">
              {topCustomers.map(customer => (
                <div key={customer.id} className="flex items-start border-b border-gray-100 pb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <span className="text-blue-600 font-medium">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{customer.name}</div>
                    <div className="text-sm text-gray-600">{customer.phone}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{formatCurrency(customer.totalSpend)}</div>
                    <div className="text-sm text-gray-600">{customer.visits} visits</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No customer data available yet</p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map(transaction => {
                const customer = customers.find(c => c.id === transaction.customerId);
                
                return (
                  <div key={transaction.id} className="flex items-start border-b border-gray-100 pb-4">
                    <div className={`p-2 rounded-full mr-3 ${
                      transaction.type === 'earn' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <CreditCard className={`h-5 w-5 ${
                          transaction.type === 'earn' ? 'text-green-600' : 'text-amber-600'
                        }`} />
                      ) : (
                        <Award className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">
                        {customer?.name || 'Unknown Customer'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.type === 'earn' 
                          ? `Receipt #${transaction.receiptNumber} - ${formatCurrency(transaction.amount)}`
                          : `Redeemed: ${transaction.rewardName}`
                        }
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'earn' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {transaction.type === 'earn' ? '+' : ''}{transaction.points} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;