import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { usePreferences } from '../../../shared/context/usePreferences';
import { useAuth } from '../../../shared/context/useAuth';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  userName: string;
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ userName, onMenuClick }) => {
  const { isDarkMode, toggleDarkMode } = usePreferences();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/logged-out');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 mr-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
          System Overview
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 text-sm w-64 transition-all"
          />
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors">
          <Bell size={20} className="text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm mr-3">
            {userName.charAt(0)}
          </div>
          <div className="hidden md:block mr-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
