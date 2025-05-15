import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLoyalty } from '../context/LoyaltyContext';

interface ProtectedRouteProps {
  role: 'customer' | 'owner';
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { currentUser, isOwner } = useLoyalty();
  
  if (role === 'owner' && !isOwner) {
    return <Navigate to="/" replace />;
  }
  
  if (role === 'customer' && !currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;