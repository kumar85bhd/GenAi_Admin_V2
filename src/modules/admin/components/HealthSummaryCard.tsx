import React, { useState } from 'react';
import { HealthStatus, Service } from '../types';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface HealthSummaryCardProps {
  services: Service[];
}

const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({ services }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Identify unhealthy services locally to avoid AI calls
  const unhealthyServices = services.filter(s => 
    s.status === HealthStatus.WARNING || s.status === HealthStatus.CRITICAL
  );
  
  const isHealthy = unhealthyServices.length === 0;
  const criticals = unhealthyServices.filter(s => s.status === HealthStatus.CRITICAL).length;
  const warnings = unhealthyServices.filter(s => s.status === HealthStatus.WARNING).length;

  const getSummaryMessage = () => {
    if (isHealthy) {
      return "All platform services are operational. Performance metrics are within expected thresholds across all monitored infrastructure segments.";
    }
    
    return `System alert: ${criticals > 0 ? `${criticals} critical failure(s) and ` : ''}${warnings} service warning(s) detected. Platform health is currently degraded. Please prioritize review of ${unhealthyServices[0].name}.`;
  };

  const getStatusColor = () => {
    if (criticals > 0) return 'bg-rose-900 border-rose-800 text-rose-100';
    if (warnings > 0) return 'bg-amber-900 border-amber-800 text-amber-100';
    return 'bg-emerald-900 border-emerald-800 text-emerald-100';
  };

  const getIcon = () => {
    if (criticals > 0) return <AlertOctagon className="w-5 h-5 text-rose-500" />;
    if (warnings > 0) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className={`
      ${getStatusColor()} 
      rounded-xl shadow-lg overflow-hidden relative border transition-all duration-300
    `}>
      {/* Header / Compact View */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-full">
            {getIcon()}
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">System Health Overview</h2>
            <p className="text-sm font-bold">
              {isHealthy ? 'All Systems Operational' : `${criticals} Critical, ${warnings} Warnings`}
            </p>
          </div>
        </div>
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
          <p className="text-sm leading-relaxed opacity-90 mt-4">
            {getSummaryMessage()}
          </p>
          
          {!isHealthy && (
            <div className="mt-4 space-y-2">
              {unhealthyServices.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-black/20 p-2 rounded text-xs">
                  <span className="font-medium">{s.name}</span>
                  <span className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                    s.status === HealthStatus.CRITICAL ? 'bg-rose-500/20 text-rose-200' : 'bg-amber-500/20 text-amber-200'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthSummaryCard;
