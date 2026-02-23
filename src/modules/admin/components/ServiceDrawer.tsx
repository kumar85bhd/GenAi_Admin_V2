import React from 'react';
import { Service, HealthStatus } from '../types';

interface ServiceDrawerProps {
  service: Service | null;
  onClose: () => void;
}

const ServiceDrawer: React.FC<ServiceDrawerProps> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-200">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">{service.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Health Status</h3>
              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className={`h-3 w-3 rounded-full ${
                  service.status === HealthStatus.HEALTHY ? 'bg-emerald-500' : 
                  service.status === HealthStatus.CRITICAL ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <span className="font-bold capitalize">{service.status}</span>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {service.metrics.map((m, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</div>
                    <div className="text-xl font-black text-slate-900">{m.value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Metadata</h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Service ID</span><span className="font-mono">{service.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Category</span><span>{service.category}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="capitalize">{service.type}</span></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDrawer;
