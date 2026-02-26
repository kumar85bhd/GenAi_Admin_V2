import React, { useState, useEffect, useMemo } from 'react';
import { AppConfig, Service, HealthStatus } from './types';
import { fetchConfig } from './services/api';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboardCards from './components/AdminDashboardCards';
import { useAuth } from '../../shared/context/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';

/**
 * AdminModule
 * Structured Infrastructure Dashboard Console.
 * Features category-grouped cards and a left sidebar filter.
 * UI is neutral and stable with no dynamic or animated effects.
 */
const AdminModule: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
            url: s.url || `https://${s.id}.example.com`,
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
        Loading Infrastructure Console...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 leading-tight text-lg">
              {config.platformName}
            </h1>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">{config.environment}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/workspace')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Workspace
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-800">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <AdminDashboardCards
              services={services}
              activeCategory={activeCategory}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminModule;
