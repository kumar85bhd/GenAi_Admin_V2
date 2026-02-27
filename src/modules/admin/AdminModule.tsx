import React, { useState, useEffect, useMemo } from 'react';
import { AppConfig, Service, HealthStatus } from './types';
import { fetchConfig } from './services/api';
import AdminDashboardCards from './components/AdminDashboardCards';
import AdminSidebar from './components/AdminSidebar';
import AdminApplicationsPage from './components/AdminApplicationsPage';
import { useAuth } from '../../shared/context/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Activity } from 'lucide-react';
import ToastContainer, { ToastMessage, ToastType } from '../../shared/components/Toast';

/**
 * AdminModule
 * Rich Infrastructure Dashboard.
 * Features a full-width grid layout with health summary and detailed service cards.
 */
const AdminModule: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isAdmin = user?.role === 'admin';

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Initialize from config
  useEffect(() => {
    fetchConfig().then(cfg => {
      setConfig(cfg);
      const initialServices: Service[] = [];
      cfg.categories.forEach(cat => {
        cat.services.forEach(s => {
          initialServices.push({
            id: s.id,
            name: s.name,
            category: cat.name,
            status: HealthStatus.HEALTHY,
            lastUpdated: new Date().toISOString(),
            type: s.type,
            url: s.url,
            description: s.description,
            metrics: [] // Metrics will be fetched by individual cards
          });
        });
      });
      setServices(initialServices);
    });
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(services.map(s => s.category))).sort();
  }, [services]);

  const handleLogout = () => {
    logout();
    navigate('/workspace');
  };

  if (!config) {
    return (
      <div className="h-screen flex items-center justify-center font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex">
      <AdminSidebar 
        activeCategory={activeCategory}
        categories={categories}
        onSelectCategory={setActiveCategory}
        isAdmin={isAdmin}
      />

      <div className="flex-1 flex flex-col min-w-0 ml-[72px] h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="bg-indigo-600 p-2 rounded-lg">
                  <Activity className="text-white w-5 h-5" />
               </div>
               <div>
                  <h1 className="font-bold text-xl text-slate-900 dark:text-white leading-none">
                    {config.platformName}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono uppercase tracking-wider">
                    {config.environment} Environment
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/workspace')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                <ArrowLeft size={16} />
                Workspace
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {activeCategory === 'applications' ? 'Application Management' : (activeCategory ? activeCategory : 'System Overview')}
                </h2>
              </div>

              {activeCategory === 'applications' ? (
                <AdminApplicationsPage addToast={addToast} />
              ) : (
                <AdminDashboardCards
                  services={services}
                  activeCategory={activeCategory}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AdminModule;
