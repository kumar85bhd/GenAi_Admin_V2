import React, { useState, useEffect } from 'react';
import { Service, Metric, HealthStatus } from '../types';
import { fetchServiceMetrics } from '../services/api';
import { ExternalLink, RefreshCw, Database, Server, Globe, Box, Activity } from 'lucide-react';

interface AdminCardProps {
  service: Service;
}

const getServiceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'database': return <Database size={18} />;
    case 'api': return <Globe size={18} />;
    case 'backend': return <Server size={18} />;
    default: return <Box size={18} />;
  }
};

const getStatusColor = (status: HealthStatus) => {
  switch (status) {
    case HealthStatus.HEALTHY: return 'bg-emerald-500';
    case HealthStatus.WARNING: return 'bg-amber-500';
    case HealthStatus.CRITICAL: return 'bg-red-500';
    default: return 'bg-slate-300';
  }
};

const getStatusBorder = (status: HealthStatus) => {
  switch (status) {
    case HealthStatus.HEALTHY: return 'border-emerald-500/20';
    case HealthStatus.WARNING: return 'border-amber-500/20';
    case HealthStatus.CRITICAL: return 'border-red-500/20';
    default: return 'border-slate-200';
  }
};

/**
 * AdminCard
 * Displays a single infrastructure service card with metrics.
 * Handles click behaviors for opening the service.
 */
const AdminCard: React.FC<AdminCardProps> = ({ service }) => {
  const [metrics, setMetrics] = useState<Metric[]>(service.metrics || []);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setLoading(true);
    try {
      const newMetrics = await fetchServiceMetrics(service.id);
      if (newMetrics && newMetrics.length > 0) {
        setMetrics(newMetrics);
      }
    } catch (error) {
      setMetrics([{ label: 'Status', value: 'N/A' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!metrics.length) {
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = (e: React.MouseEvent) => {
    const url = service.url || `https://${service.id}.example.com`;
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(url, '_blank');
    } else {
      window.open(url, '_self');
    }
  };

  return (
    <div
      onClick={handleOpen}
      onAuxClick={handleOpen}
      className={`group relative bg-white dark:bg-slate-800 border ${getStatusBorder(service.status)} shadow-sm hover:shadow-md hover:-translate-y-1 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col h-full`}
    >
      {/* Status Indicator Line */}
      <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${getStatusColor(service.status)} opacity-80`} />

      <div className="flex justify-between items-start mb-4 mt-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
            {getServiceIcon(service.type)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {service.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 capitalize">{service.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="p-1.5 text-slate-400">
             <ExternalLink size={14} />
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        {metrics.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5 border border-slate-100 dark:border-slate-700/50">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{m.label}</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">{m.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center gap-2 text-slate-400">
            <Activity size={14} />
            <span className="text-xs font-medium">No metrics available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;
