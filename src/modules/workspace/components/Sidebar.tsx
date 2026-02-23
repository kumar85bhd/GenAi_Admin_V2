import React from 'react';
import { LayoutDashboard, Star, ChevronLeft, ChevronRight, Hash, Users, BookOpen, Server, Presentation, Zap, Layers } from 'lucide-react';
import { FilterType } from '../../../shared/types';

interface SidebarProps {
  activeFilter: FilterType;
  activeCategory: string | null;
  categories: string[];
  onNavigate: (filter: FilterType, category: string | null) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  className?: string;
}

const getCategoryIcon = (category: string) => {
  const map: Record<string, React.ReactNode> = {
    'Customer': <Users size={20} />,
    'Knowledge': <BookOpen size={20} />,
    'Platform': <Server size={20} />,
    'Presentation': <Presentation size={20} />,
    'Productivity': <Zap size={20} />,
  };
  return map[category] || <Hash size={20} />;
};

const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  activeCategory,
  categories,
  onNavigate,
  isCollapsed,
  toggleCollapse,
  className = ''
}) => {
  return (
    <aside className={`glass-panel border-r border-white/10 shadow-sm flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-16' : 'w-64'} ${className} z-30`}>
      <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 animate-in fade-in duration-300">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold font-serif text-sm shadow-sm shadow-primary/20">
              G
            </div>
            <span className="font-serif font-bold text-lg text-foreground tracking-tight truncate">
              GenAI
            </span>
          </div>
        )}
        <button 
          onClick={toggleCollapse}
          className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors ml-auto focus:outline-none focus:ring-2 focus:ring-ring/40"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-8">
        <div className="px-3">
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('dashboard', null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 transition-all duration-200 group relative rounded-lg ${
                activeFilter === 'dashboard' && !activeCategory 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              } focus:outline-none focus:ring-2 focus:ring-ring/40`}
            >
              <LayoutDashboard size={20} className={`transition-colors ${activeFilter === 'dashboard' && !activeCategory ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              {!isCollapsed && <span className="text-sm">Dashboard</span>}
            </button>
            <button
              onClick={() => onNavigate('favorites', null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 transition-all duration-200 group relative rounded-lg ${
                activeFilter === 'favorites' 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              } focus:outline-none focus:ring-2 focus:ring-ring/40`}
            >
              <Star size={20} className={`transition-colors ${activeFilter === 'favorites' ? 'text-primary' : 'text-muted-foreground group-hover:text-amber-500'}`} />
              {!isCollapsed && <span className="text-sm">Favorites</span>}
            </button>
          </div>
        </div>

        <div className="px-3">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 pl-4">
              Categories
            </p>
          )}
          <div className="space-y-0.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onNavigate('dashboard', cat)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 transition-all duration-200 group relative rounded-lg ${
                  activeCategory === cat 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                } focus:outline-none focus:ring-2 focus:ring-ring/40`}
              >
                {activeCategory === cat && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
                <span className={`transition-colors ${activeCategory === cat ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {React.cloneElement(getCategoryIcon(cat) as React.ReactElement, { size: 18 })}
                </span>
                {!isCollapsed && <span className="truncate text-sm">{cat}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
