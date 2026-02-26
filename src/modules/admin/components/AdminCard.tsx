import React, { useState, useEffect } from 'react';
import { Service, Metric } from '../types';
import { fetchServiceMetrics } from '../services/api';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface AdminCardProps {
  service: Service;
}

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
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg p-4 cursor-pointer transition-colors flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{service.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{service.type}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <ExternalLink size={14} className="text-slate-400" />
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        {metrics.length > 0 ? metrics.map((m, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded p-2 border border-slate-100 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.value}</div>
          </div>
        )) : (
          <div className="col-span-2 bg-slate-50 dark:bg-slate-900 rounded p-2 border border-slate-100 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Metrics</div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">N/A</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;
