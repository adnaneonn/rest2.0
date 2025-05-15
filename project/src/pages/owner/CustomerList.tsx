import React, { useState } from 'react';
import { useLoyalty } from '../../context/LoyaltyContext';
import { Search, User, Calendar, CreditCard, Award } from 'lucide-react';

const CustomerList: React.FC = () => {
  const { customers, transactions } = useLoyalty();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  // Get customer details
  const getCustomerDetails = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;
    
    const customerTransactions = transactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const earnTransactions = customerTransactions.filter(t => t.type === 'earn');
    const redeemTransactions = customerTransactions.filter(t => t.type === 'redeem');
    
    const totalSpent = earnTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageSpend = earnTransactions.length > 0 ? totalSpent / earnTransactions.length : 0;
    
    return {
      customer,
      transactions: customerTransactions,
      totalSpent,
      averageSpend,
      earnCount: earnTransactions.length,
      redeemCount: redeemTransactions.length,
    };
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `AED ${amount.toFixed(2)}`;
  };
  
  const selectedCustomerDetails = selectedCustomer ? getCustomerDetails(selectedCustomer) : null;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Customer Management
        </h1>
        <p className="text-gray-600">
          View and analyze customer data and loyalty program participation
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer.id)}
                    className={`w-full px-4 py-3 flex items-start border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedCustomer === customer.id ? 'bg-amber-50' : ''
                    }`}
                  >
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {customer.points} points
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {customer.visits} visits
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No customers found matching your search
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomerDetails ? (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedCustomerDetails.customer.name}
                    </h2>
                    <p className="text-gray-600">{selectedCustomerDetails.customer.phone}</p>
                    {selectedCustomerDetails.customer.email && (
                      <p className="text-gray-600">{selectedCustomerDetails.customer.email}</p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className="bg-amber-100 rounded-md px-3 py-1">
                      <span className="text-amber-800 font-medium">{selectedCustomerDetails.customer.points} points</span>
                    </div>
                    <div className="bg-blue-100 rounded-md px-3 py-1">
                      <span className="text-blue-800 font-medium">{selectedCustomerDetails.customer.visits} visits</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-600 mb-1">Member Since</div>
                    <div className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDate(selectedCustomerDetails.customer.registeredAt)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                    <div className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                      {formatCurrency(selectedCustomerDetails.totalSpent)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-600 mb-1">Average Bill</div>
                    <div className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                      {formatCurrency(selectedCustomerDetails.averageSpend)}
                    </div>
                  </div>
                </div>
                
                {selectedCustomerDetails.customer.lastVisit && (
                  <div className="text-sm text-gray-600">
                    Last visit on {formatDate(selectedCustomerDetails.customer.lastVisit)}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
                
                {selectedCustomerDetails.transactions.length > 0 ? (
                  <div className="space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto">
                    {selectedCustomerDetails.transactions.map(transaction => (
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
                            {transaction.type === 'earn' 
                              ? `Receipt #${transaction.receiptNumber}`
                              : `Redeemed: ${transaction.rewardName}`
                            }
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(transaction.timestamp)}
                            {transaction.type === 'earn' && (
                              <span className="ml-2">{formatCurrency(transaction.amount)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className={`font-semibold ${
                          transaction.type === 'earn' ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {transaction.type === 'earn' ? '+' : ''}{transaction.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No transaction history available</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a Customer</h2>
              <p className="text-gray-500">
                Click on a customer from the list to view their detailed information and transaction history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;