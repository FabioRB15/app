import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import DashboardSidebar from './DashboardSidebar';
import DashboardOverview from './DashboardOverview';
import UserProfile from './UserProfile';
import UserServers from './UserServers';
import AccountSettings from './AccountSettings';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
        />

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<DashboardOverview user={user} />} />
              <Route path="/profile" element={<UserProfile user={user} />} />
              <Route path="/servers" element={<UserServers user={user} />} />
              <Route path="/settings" element={<AccountSettings user={user} />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;