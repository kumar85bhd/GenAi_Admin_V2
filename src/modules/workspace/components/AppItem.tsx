import React from 'react';
import { Star, ExternalLink, Zap, FileText, Wrench, Cpu, BarChart3, MessageSquare, Shield, TrendingUp, Book, Link, Code, Palette, ArrowUpRight, Activity } from 'lucide-react';
import { AppData, ViewMode } from '../../../shared/types';
import { Tooltip } from '../../../shared/components/ui/Tooltip';
import { usePreferences } from '../../../shared/context/PreferencesContext';
import { motion } from 'framer-motion';

// Icon mapping helper
const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Zap: <Zap />,
    FileText: <FileText />,
    Wrench: <Wrench />,
    Cpu: <Cpu />,
    BarChart3: <BarChart3 />,
    MessageSquare: <MessageSquare />,
    Shield: <Shield />,
    TrendingUp: <TrendingUp />,
    Book: <Book />,
    Link: <Link />,
    Code: <Code />,
    Palette: <Palette />
  };
  return icons[iconName] || <Zap />;
};

// Category styling helper - Semantic Colors
const getCategoryStyles = (category: string) => {
  const styles: Record<string, string> = {
    Productivity: 'bg-primary/10 text-primary',
    Knowledge: 'bg-emerald-500/10 text-emerald-500',
    Platform: 'bg-amber-500/10 text-amber-500',
    Customer: 'bg-sky-500/10 text-sky-500',
  };
  return styles[category] || 'bg-secondary text-secondary-foreground';
};

interface AppItemProps {
  app: AppData;
  viewMode: ViewMode;
  onToggleFav: (id: number) => void;
  onOpenDetail: (id: number) => void;
  index?: number; // Added for staggered animation
}

const AppItem: React.FC<AppItemProps> = ({ app, viewMode, onToggleFav, onOpenDetail, index = 0 }) => {
  const { openInNewTab } = usePreferences();
  const categoryStyle = getCategoryStyles(app.category);

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(app.url, openInNewTab ? '_blank' : '_self');
  };

  if (viewMode === 'icon') {
    return (
      <motion.div 
        className="group bg-card p-4 rounded-2xl border border-border shadow-sm hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center text-center relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        onClick={() => onOpenDetail(app.id)}
        tabIndex={0}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Tooltip content={app.isFavorite ? "Remove from Favorites" : "Add to Favorites"} className="z-50">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFav(app.id); }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 ${
              app.isFavorite 
                ? 'text-amber-400 bg-amber-500/10' 
                : 'text-muted-foreground/50 hover:bg-secondary'
            }`}
          >
            <Star size={14} fill={app.isFavorite ? "currentColor" : "none"} />
          </button>
        </Tooltip>
        
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm ${categoryStyle}`}>
          {React.cloneElement(getIcon(app.icon) as React.ReactElement, { size: 28 })}
        </div>
        <h3 className="font-semibold text-foreground text-sm truncate w-full px-2">{app.name}</h3>
        <p className="text-xs text-muted-foreground truncate w-full mt-1 px-2">{app.category}</p>
      </motion.div>
    );
  }

  // Card View - Refined
  return (
    <motion.div 
      className={`group bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_10px_30px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col cursor-pointer h-full relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${app.isFavorite ? 'border-l-4 border-l-primary' : ''}`}
      onClick={() => onOpenDetail(app.id)}
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {/* Hover Glow Effect - Subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

      <div className="p-5 flex-1 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${categoryStyle}`}>
            {React.cloneElement(getIcon(app.icon) as React.ReactElement, { size: 20 })}
          </div>
          <div className="flex flex-col items-end gap-1">
             <Tooltip content={app.isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFav(app.id); }}
                className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 ${
                  app.isFavorite 
                    ? 'text-amber-400 bg-amber-500/10' 
                    : 'text-muted-foreground/50 hover:bg-secondary'
                }`}
              >
                <Star size={14} fill={app.isFavorite ? "currentColor" : "none"} />
              </button>
            </Tooltip>
          </div>
        </div>

        <h3 className="font-bold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors tracking-tight truncate">
          {app.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-sans min-h-[2.5rem]">
          {app.desc}
        </p>
      </div>

      <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2 relative z-10">
        <Tooltip content={`Launch in ${openInNewTab ? 'new' : 'same'} tab`}>
          <button 
            onClick={handleLaunch}
            className="group/btn flex items-center gap-1.5 bg-primary hover:brightness-110 text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-2 px-3.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-primary/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <span>Launch</span>
            <span className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200">
              {openInNewTab ? <ExternalLink size={10} /> : <ArrowUpRight size={10} />}
            </span>
          </button>
        </Tooltip>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary border border-border">
             <Activity size={10} className="text-emerald-500" />
             <span className="text-[10px] font-medium text-secondary-foreground truncate max-w-[80px]">{app.baseActivity.split(':')[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppItem;
