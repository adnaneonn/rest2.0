import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLoyalty } from '../context/LoyaltyContext';
import { Utensils, LogOut, User, Award, BarChart2, Users, Settings } from 'lucide-react';

interface LayoutProps {
  isOwner?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isOwner = false }) => {
  const { currentUser, isAuthenticated, isOwner: isOwnerAuth, logout } = useLoyalty();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Utensils className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold">Dishtally</h1>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center">
              {currentUser && (
                <span className="mr-4 hidden md:block">
                  Welcome, {currentUser.name}
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Only show when authenticated */}
        {isAuthenticated && (
          <aside className="bg-white w-16 md:w-64 shadow-md flex flex-col">
            {isOwner || isOwnerAuth ? (
              // Owner Navigation
              <nav className="flex flex-col py-6">
                <button 
                  onClick={() => navigate('/owner')}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                >
                  <BarChart2 className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:block">Dashboard</span>
                </button>
                <button 
                  onClick={() => navigate('/owner/customers')}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                >
                  <Users className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:block">Customers</span>
                </button>
                <button 
                  onClick={() => navigate('/owner/rewards')}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                >
                  <Award className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:block">Rewards</span>
                </button>
              </nav>
            ) : (
              // Customer Navigation
              <nav className="flex flex-col py-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                >
                  <User className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:block">My Dashboard</span>
                </button>
                <button 
                  onClick={() => navigate('/redeem')}
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                >
                  <Award className="h-5 w-5 md:mr-3" />
                  <span className="hidden md:block">Redeem Rewards</span>
                </button>
              </nav>
            )}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 Dishtally - Restaurant Loyalty System for UAE</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;