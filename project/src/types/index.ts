export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthdate?: string;
  points: number;
  visits: number;
  lastVisit?: string;
  registeredAt: string;
  birthdayRewardClaimed?: string; // Track when birthday reward was last claimed
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  category: 'food' | 'drink' | 'dessert' | 'other';
  imageUrl?: string;
  isActive: boolean;
  isBirthdayReward?: boolean; // Special rewards for birthdays
}

export interface Receipt {
  id: string;
  customerId: string;
  receiptNumber: string;
  amount: number;
  date: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  receiptNumber: string;
  amount: number;
  points: number;
  type: 'earn' | 'redeem' | 'birthday';  // Added birthday type
  rewardId?: string;
  rewardName?: string;
  date: string;
  timestamp: string;
}