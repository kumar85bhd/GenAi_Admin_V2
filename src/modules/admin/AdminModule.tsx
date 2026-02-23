import React, { useState, useMemo, useEffect } from 'react';
import { HealthStatus, Service, AppConfig } from './types';
import ServiceCard from './components/ServiceCard';
import HealthSummaryCard from './components/HealthSummaryCard';
import ServiceDrawer from './components/ServiceDrawer';
import { fetchConfig } from './services/api';
import { useAuth } from '../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminModule: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [refreshInterval] = useState(15000);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

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
            url: `https://${s.id}.example.com`, // Mock URL for demo
            metrics: [
              { label: 'CPU', value: '12%', history: [10, 15, 12, 14, 12, 11] },
              { label: 'Memory', value: '450MB', history: [400, 420, 450, 440, 455] }
            ]
          });
        });
      });
      setServices(initialServices);
    });
  }, []);

  // Polling logic
  useEffect(() => {
    if (!config) return;
    const interval = setInterval(async () => {
      setServices(prev => prev.map(s => ({
        ...s,
        lastUpdated: new Date().toISOString(),
        metrics: s.metrics.map(m => {
          const lastVal = m.history[m.history.length - 1];
          const newVal = Math.max(0, lastVal + (Math.random() * 20 - 10));
          const newHistory = [...m.history.slice(1), newVal];
          return {
            ...m,
            value: typeof lastVal === 'number' ? `${Math.round(newVal)}%` : m.value,
            history: newHistory
          };
        })
      })));
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [config, refreshInterval]);

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  const stats = useMemo(() => {
    const unhealthy = services.filter(s => s.status !== HealthStatus.HEALTHY && s.status !== HealthStatus.ACTIVE).length;
    return { total: services.length, unhealthy };
  }, [services]);

  const categories = useMemo(() => {
    return Array.from(new Set(services.map(s => s.category))).sort();
  }, [services]);

  const handleLogout = () => {
    logout();
    navigate('/workspace'); // Or login page if one existed
  };

  if (!config) return <div className="h-screen flex items-center justify-center font-bold text-muted-foreground">Initializing Platform...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background text-foreground font-sans"
    >
      <div className={`h-1.5 w-full transition-colors duration-500 ${stats.unhealthy > 0 ? 'bg-destructive' : 'bg-primary'}`}></div>

      <header className="bg-card border-b border-border px-6 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="font-black text-foreground leading-tight text-sm uppercase tracking-tight">{config.platformName}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-accent-foreground font-bold uppercase tracking-widest">{config.environment}</span>
              <span className="text-muted-foreground text-[10px]">•</span>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">v2.1.0</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search services..." 
              className="block w-full pl-10 pr-3 py-2 border border-input rounded-xl leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-secondary rounded-lg p-1 mr-2 border border-border">
            <button onClick={() => setViewType('grid')} className={`p-1.5 rounded transition-all ${viewType === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-secondary-foreground hover:text-primary'}`}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewType('list')} className={`p-1.5 rounded transition-all ${viewType === 'list' ? 'bg-background shadow-sm text-primary' : 'text-secondary-foreground hover:text-primary'}`}>
              <List size={16} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />

          <button 
            onClick={() => navigate('/workspace')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-secondary-foreground hover:bg-secondary rounded-lg transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Back to App
          </button>

          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs border border-border">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-destructive transition-colors ml-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
        <HealthSummaryCard services={services} />
        
        {categories.map(cat => {
          const categoryServices = filteredServices.filter(s => s.category === cat);
          if (categoryServices.length === 0) return null;
          return (
            <motion.section 
              key={cat} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div onClick={() => {
                const next = new Set(collapsedSections);
                if (next.has(cat)) next.delete(cat); else next.add(cat);
                setCollapsedSections(next);
              }} className="flex justify-between items-center group cursor-pointer border-b border-border pb-2 select-none">
                <h2 className="text-xs font-black text-foreground uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{cat} ({categoryServices.length})</h2>
                <div className={`text-muted-foreground transition-transform duration-300 ${collapsedSections.has(cat) ? '-rotate-90' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {!collapsedSections.has(cat) && (
                <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
                  {categoryServices.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      viewType={viewType} 
                      onClick={setSelectedService} 
                    />
                  ))}
                </div>
              )}
            </motion.section>
          );
        })}
      </main>

      <ServiceDrawer service={selectedService} onClose={() => setSelectedService(null)} />
    </motion.div>
  );
};

export default AdminModule;
