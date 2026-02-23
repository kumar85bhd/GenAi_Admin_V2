import React from 'react';
import { Service, HealthStatus } from '../types';
import { ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  viewType: 'grid' | 'list';
  onClick: (s: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewType, onClick }) => {
  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'bg-emerald-500';
      case HealthStatus.WARNING: return 'bg-amber-500';
      case HealthStatus.CRITICAL: return 'bg-rose-500';
      case HealthStatus.ACTIVE: return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  const getBorderColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'border-l-emerald-500';
      case HealthStatus.WARNING: return 'border-l-amber-500';
      case HealthStatus.CRITICAL: return 'border-l-rose-500';
      case HealthStatus.ACTIVE: return 'border-l-blue-500';
      default: return 'border-l-slate-400';
    }
  };

  const isGrid = viewType === 'grid';

  const handleOpenApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (service.url) {
      window.open(service.url, '_blank');
    } else {
      // Fallback or alert if no URL
      alert(`Opening ${service.name}... (No URL configured)`);
    }
  };

  return (
    <div 
      onClick={() => onClick(service)}
      className={`
        bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 ${getBorderColor(service.status)}
        hover:shadow-lg hover:border-slate-200 transition-all duration-200 cursor-pointer overflow-hidden group
        ${isGrid ? 'p-5 flex flex-col h-full' : 'p-4 flex flex-row items-center justify-between gap-4'}
      `}
    >
      <div className={isGrid ? 'mb-4' : 'flex-1'}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
            {service.name}
          </h3>
          {!isGrid && <span className="text-[9px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded uppercase">ID: {service.id}</span>}
          
          {/* Open App Button (Visible on Hover) */}
          <button 
            onClick={handleOpenApp}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"
            title="Open Application"
          >
            <ExternalLink size={14} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${getStatusColor(service.status)}`}></span>
          <span className={`font-bold capitalize text-[10px] ${getStatusColor(service.status).replace('bg-', 'text-')}`}>
            {service.status}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400 text-[9px] font-medium">Updated: {new Date(service.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className={`
        ${isGrid ? 'mt-auto grid grid-cols-2 gap-2' : 'flex-2 flex items-center space-x-4'}
      `}>
        {service.metrics.map((m, i) => (
          <div key={i} className={`
            bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-100 group transition-colors hover:bg-white
            ${!isGrid && 'min-w-[120px]'}
          `}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[8px] uppercase font-black text-slate-400 tracking-widest">{m.label}</span>
            </div>
            <span className="text-sm font-black text-slate-700 tracking-tight">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
