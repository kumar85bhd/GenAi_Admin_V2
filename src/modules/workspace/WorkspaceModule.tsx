import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import AppItem from './components/AppItem';
import DetailPanel from './components/DetailPanel';
import CategoryNav from './components/CategoryNav';
import ToastContainer, { ToastMessage, ToastType } from '../../shared/components/Toast';
import { AppData, FilterType, ViewMode } from '../../shared/types';
import { api } from '../../shared/services/api';
import { PackageOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { motion } from 'framer-motion';

const WorkspaceModule: React.FC = () => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('dashboard');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { user } = useAuth();
  const userName = user?.name || "Guest";

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const initWorkspace = async () => {
      setLoading(true);
      
      const { data, isLive: liveStatus } = await api.getApps();
      setApps(data);
      setIsLive(liveStatus);
      
      if (!liveStatus) {
        addToast("Backend server is unreachable. Showing cached tools.", "error");
      }
      
      setLoading(false);
    };

    initWorkspace();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(apps.map(a => a.category))).sort();
  }, [apps]);

  const handleToggleFav = async (id: number) => {
    const app = apps.find(a => a.id === id);
    if (!app) return;

    const newStatus = !app.isFavorite;
    
    setApps(prev => prev.map(a => 
      a.id === id ? { ...a, isFavorite: newStatus } : a
    ));

    addToast(`${newStatus ? 'Added to' : 'Removed from'} favorites: ${app.name}`, "success");

    try {
      if (isLive) {
        await api.toggleFavorite(id);
      }
    } catch (err) {
      console.warn("Favorite change not synced to backend.");
    }
  };

  const handleNavigate = (filter: FilterType, category: string | null) => {
    setActiveFilter(filter);
    setActiveCategory(category);
    setIsSidebarOpen(false);
  };

  const filteredApps = useMemo(() => {
    let result = apps;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q)
      );
    }
    if (activeFilter === 'favorites') {
      result = result.filter(app => app.isFavorite);
    } else if (activeFilter === 'dashboard' && activeCategory) {
      result = result.filter(app => app.category === activeCategory);
    }
    return result;
  }, [apps, searchQuery, activeFilter, activeCategory]);

  const selectedApp = useMemo(() => 
    apps.find(a => a.id === selectedAppId) || null
  , [apps, selectedAppId]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
          <p className="text-lg font-medium">Authenticating & Synchronizing...</p>
        </div>
      );
    }

    if (filteredApps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <PackageOpen className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No tools found.</p>
          <button onClick={() => {setSearchQuery(''); setActiveCategory(null); setActiveFilter('dashboard');}} className="mt-2 text-primary hover:underline">
            Clear filters
          </button>
        </div>
      );
    }

    return (
      <motion.div 
        className={`grid gap-6 ${viewMode === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'} pb-20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {filteredApps.map((app, index) => (
          <AppItem 
            key={app.id} 
            app={app} 
            viewMode={viewMode} 
            onToggleFav={handleToggleFav}
            onOpenDetail={setSelectedAppId}
            index={index}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden transition-colors duration-300 text-foreground relative">
      {/* Animated AI Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Ambient Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-50/30 to-indigo-50/30 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-purple-900/20 dark:via-background/0 dark:to-background/0" />
        
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-500/30 dark:bg-emerald-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-fuchsia-500/30 dark:bg-fuchsia-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar 
        activeFilter={activeFilter} 
        activeCategory={activeCategory} 
        categories={categories}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`fixed md:relative z-30 h-full transform transition-all duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header 
          userName={userName}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onMenuClick={() => setIsSidebarOpen(true)}
          totalApps={apps.length}
          isLive={isLive}
          addToast={addToast}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth no-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
             {/* Show Hero only on main dashboard view without search */}
             {!searchQuery && activeFilter === 'dashboard' && !activeCategory && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
               >
                 <Hero />
               </motion.div>
             )}

             {/* Category Navigation (Horizontal) */}
             {!searchQuery && activeFilter === 'dashboard' && (
               <CategoryNav 
                 categories={categories} 
                 activeCategory={activeCategory} 
                 onSelectCategory={(cat) => handleNavigate('dashboard', cat)} 
               />
             )}

             <motion.div 
                key={activeFilter + '-' + activeCategory} 
                className="glass-panel rounded-3xl relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
               <div className="p-6 md:p-8">
                 {renderContent()}
               </div>
             </motion.div>
          </div>
        </div>
      </main>

      <DetailPanel 
        app={selectedApp} 
        onClose={() => setSelectedAppId(null)} 
        onToggleFav={handleToggleFav}
      />
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default WorkspaceModule;
