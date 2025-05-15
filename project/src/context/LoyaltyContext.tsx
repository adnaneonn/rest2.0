import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Receipt, Reward, Transaction } from '../types';
import { sampleRewards, sampleCustomers, sampleTransactions } from '../data/sampleData';

interface LoyaltyContextType {
  customers: Customer[];
  rewards: Reward[];
  transactions: Transaction[];
  currentUser: Customer | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  pointsPerDirham: number;
  register: (customer: Omit<Customer, 'id' | 'points' | 'visits'>) => void;
  login: (phone: string) => void;
  loginAsOwner: (password: string) => void;
  logout: () => void;
  validateReceipt: (receiptData: Omit<Receipt, 'id' | 'customerId'>) => { success: boolean; points: number };
  redeemReward: (rewardId: string) => { success: boolean; code: string };
  updateReward: (reward: Reward) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updatePointsRate: (rate: number) => void;
  checkBirthdayReward: () => { available: boolean; reward: Reward | null };
  claimBirthdayReward: () => { success: boolean; code: string };
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [rewards, setRewards] = useState<Reward[]>(sampleRewards);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [pointsPerDirham, setPointsPerDirham] = useState(0.5);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const isOwnerStored = localStorage.getItem('isOwner');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (isOwnerStored === 'true') {
      setIsOwner(true);
    }
    
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    }
    
    const storedRewards = localStorage.getItem('rewards');
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    }
    
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    
    const storedPointsRate = localStorage.getItem('pointsPerDirham');
    if (storedPointsRate) {
      setPointsPerDirham(parseFloat(storedPointsRate));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('rewards', JSON.stringify(rewards));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('pointsPerDirham', pointsPerDirham.toString());
    
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
    
    localStorage.setItem('isOwner', isOwner.toString());
  }, [customers, rewards, transactions, currentUser, isOwner, pointsPerDirham]);

  const register = (customerData: Omit<Customer, 'id' | 'points' | 'visits'>) => {
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      points: 0,
      visits: 0,
      ...customerData,
      registeredAt: new Date().toISOString(),
    };
    
    setCustomers([...customers, newCustomer]);
    setCurrentUser(newCustomer);
    return newCustomer;
  };

  const login = (phone: string) => {
    const customer = customers.find(c => c.phone === phone);
    if (customer) {
      setCurrentUser(customer);
      setIsOwner(false);
      return true;
    }
    return false;
  };

  const loginAsOwner = (password: string) => {
    if (password === 'owner123') {
      setIsOwner(true);
      setCurrentUser(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsOwner(false);
  };

  const validateReceipt = (receiptData: Omit<Receipt, 'id' | 'customerId'>) => {
    if (!currentUser) {
      return { success: false, points: 0 };
    }
    
    const existingTransaction = transactions.find(t => 
      t.receiptNumber === receiptData.receiptNumber && 
      t.date === receiptData.date
    );
    
    if (existingTransaction) {
      return { success: false, points: 0 };
    }
    
    const pointsEarned = Math.floor(receiptData.amount * pointsPerDirham);
    
    const updatedCustomers = customers.map(c => {
      if (c.id === currentUser.id) {
        return {
          ...c,
          points: c.points + pointsEarned,
          visits: c.visits + 1,
          lastVisit: new Date().toISOString()
        };
      }
      return c;
    });
    
    const newTransaction = {
      id: `trans_${Date.now()}`,
      customerId: currentUser.id,
      receiptNumber: receiptData.receiptNumber,
      amount: receiptData.amount,
      points: pointsEarned,
      type: 'earn' as const,
      date: receiptData.date,
      timestamp: new Date().toISOString(),
    };
    
    setCustomers(updatedCustomers);
    setTransactions([...transactions, newTransaction]);
    
    const updatedUser = updatedCustomers.find(c => c.id === currentUser.id);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
    
    return { success: true, points: pointsEarned };
  };

  const checkBirthdayReward = () => {
    if (!currentUser?.birthdate) {
      return { available: false, reward: null };
    }

    const birthdayReward = rewards.find(r => r.isBirthdayReward && r.isActive);
    if (!birthdayReward) {
      return { available: false, reward: null };
    }

    const today = new Date();
    const birthday = new Date(currentUser.birthdate);
    
    // Check if it's the customer's birthday month
    if (today.getMonth() !== birthday.getMonth()) {
      return { available: false, reward: null };
    }

    // Check if reward was already claimed this year
    const thisYear = today.getFullYear();
    const alreadyClaimed = transactions.some(t => 
      t.customerId === currentUser.id &&
      t.type === 'birthday' &&
      new Date(t.timestamp).getFullYear() === thisYear
    );

    return { 
      available: !alreadyClaimed && today.getDate() === birthday.getDate(),
      reward: birthdayReward 
    };
  };

  const claimBirthdayReward = () => {
    const { available, reward } = checkBirthdayReward();
    
    if (!available || !reward || !currentUser) {
      return { success: false, code: '' };
    }

    const redemptionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newTransaction = {
      id: `trans_${Date.now()}`,
      customerId: currentUser.id,
      receiptNumber: redemptionCode,
      amount: 0,
      points: 0,
      type: 'birthday' as const,
      rewardId: reward.id,
      rewardName: reward.name,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    
    setTransactions([...transactions, newTransaction]);
    
    return { success: true, code: redemptionCode };
  };

  const redeemReward = (rewardId: string) => {
    if (!currentUser) {
      return { success: false, code: '' };
    }
    
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, code: '' };
    }
    
    if (reward.isBirthdayReward) {
      return claimBirthdayReward();
    }
    
    if (currentUser.points < reward.pointsRequired) {
      return { success: false, code: '' };
    }
    
    const redemptionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const updatedCustomers = customers.map(c => {
      if (c.id === currentUser.id) {
        return {
          ...c,
          points: c.points - reward.pointsRequired
        };
      }
      return c;
    });
    
    const newTransaction = {
      id: `trans_${Date.now()}`,
      customerId: currentUser.id,
      receiptNumber: redemptionCode,
      amount: 0,
      points: -reward.pointsRequired,
      type: 'redeem' as const,
      rewardId: reward.id,
      rewardName: reward.name,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    
    setCustomers(updatedCustomers);
    setTransactions([...transactions, newTransaction]);
    
    const updatedUser = updatedCustomers.find(c => c.id === currentUser.id);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
    
    return { success: true, code: redemptionCode };
  };

  const updateReward = (reward: Reward) => {
    const updatedRewards = rewards.map(r => {
      if (r.id === reward.id) {
        return reward;
      }
      return r;
    });
    
    setRewards(updatedRewards);
  };

  const addReward = (rewardData: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      id: `reward_${Date.now()}`,
      ...rewardData
    };
    
    setRewards([...rewards, newReward]);
  };

  const updatePointsRate = (rate: number) => {
    setPointsPerDirham(rate);
  };

  const value = {
    customers,
    rewards,
    transactions,
    currentUser,
    isAuthenticated: !!currentUser || isOwner,
    isOwner,
    pointsPerDirham,
    register,
    login,
    loginAsOwner,
    logout,
    validateReceipt,
    redeemReward,
    updateReward,
    addReward,
    updatePointsRate,
    checkBirthdayReward,
    claimBirthdayReward
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};