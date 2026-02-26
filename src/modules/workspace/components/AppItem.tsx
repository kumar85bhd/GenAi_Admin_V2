import React from 'react';
import { Star, ExternalLink, Zap, FileText, Wrench, Cpu, BarChart3, MessageSquare, Shield, TrendingUp, Book, Link, Code, Palette, ArrowUpRight, Activity } from 'lucide-react';
import { AppData, ViewMode } from '../../../shared/types';
import { Tooltip } from '../../../shared/components/ui/Tooltip';
import { usePreferences } from '../../../shared/context/usePreferences';
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
  const styles: Record<string, { bg: string, text: string, border: string, shadow: string, gradient: string }> = {
    'Productivity': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500 dark:text-fuchsia-400', border: 'group-hover:border-fuchsia-500/50', shadow: 'group-hover:shadow-fuchsia-500/20', gradient: 'from-fuchsia-500 to-purple-600' },
    'Knowledge': { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', border: 'group-hover:border-emerald-500/50', shadow: 'group-hover:shadow-emerald-500/20', gradient: 'from-emerald-400 to-cyan-500' },
    'Platform': { bg: 'bg-orange-500/10', text: 'text-orange-500 dark:text-orange-400', border: 'group-hover:border-orange-500/50', shadow: 'group-hover:shadow-orange-500/20', gradient: 'from-orange-400 to-rose-500' },
    'Customer': { bg: 'bg-blue-500/10', text: 'text-blue-500 dark:text-blue-400', border: 'group-hover:border-blue-500/50', shadow: 'group-hover:shadow-blue-500/20', gradient: 'from-blue-400 to-indigo-500' },
    'Presentation': { bg: 'bg-pink-500/10', text: 'text-pink-500 dark:text-pink-400', border: 'group-hover:border-pink-500/50', shadow: 'group-hover:shadow-pink-500/20', gradient: 'from-pink-400 to-rose-500' },
  };
  return styles[category] || { bg: 'bg-slate-500/10', text: 'text-slate-500 dark:text-slate-400', border: 'group-hover:border-slate-500/50', shadow: 'group-hover:shadow-slate-500/20', gradient: 'from-slate-400 to-slate-600' };
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
  const catStyles = getCategoryStyles(app.category);

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(app.url, openInNewTab ? '_blank' : '_self');
  };

  if (viewMode === 'icon') {
    return (
      <motion.div 
        className={`group glass-card p-4 rounded-2xl border border-white/10 shadow-sm hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center text-center relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${catStyles.border} ${catStyles.shadow}`}
        onClick={() => onOpenDetail(app.id)}
        tabIndex={0}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Tooltip 
          content={app.isFavorite ? "Remove from Favorites" : "Add to Favorites"} 
          className="absolute top-2 right-2 z-50"
          position="left"
        >
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
        
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm bg-gradient-to-br ${catStyles.gradient} text-white`}>
          {React.cloneElement(getIcon(app.icon) as React.ReactElement, { size: 28 })}
        </div>
        <h3 className={`font-semibold text-foreground text-sm truncate w-full px-2 transition-colors ${catStyles.text}`}>{app.name}</h3>
        <p className="text-xs text-muted-foreground truncate w-full mt-1 px-2">{app.category}</p>
      </motion.div>
    );
  }

  // Card View - Refined
  return (
    <motion.div 
      className={`group relative glass-card rounded-xl border border-white/10 shadow-sm 
        hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-slate-500/40 
        active:scale-[0.98] transition-all duration-300 ease-out 
        flex flex-col cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background 
        ${app.isFavorite ? 'border-l-4 border-l-amber-400' : ''}
        overflow-hidden`}
      onClick={() => onOpenDetail(app.id)}
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
    >
      {/* Soft Accent Border Glow */}
      <div className={`absolute -inset-[1px] bg-gradient-to-br ${catStyles.gradient} opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300 -z-10 rounded-xl`} />

      {/* Hover Glow Effect - Subtle */}
      <div className={`absolute inset-0 bg-gradient-to-br ${catStyles.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-xl`} />

      <div className="p-4 flex-1 relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br ${catStyles.gradient} text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            {React.cloneElement(getIcon(app.icon) as React.ReactElement, { size: 18 })}
          </div>
          <div className="flex flex-col items-end gap-1">
             <Tooltip content={app.isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFav(app.id); }}
                className={`p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 ${
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

        <h3 className={`font-bold text-sm text-foreground mb-0.5 transition-colors tracking-tight truncate ${catStyles.text}`}>
          {app.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed truncate font-sans">
          {app.desc}
        </p>
      </div>

      <div className="px-4 pb-4 pt-0 flex items-center justify-between gap-2 relative z-10">
        <Tooltip content={`Launch in ${openInNewTab ? 'new' : 'same'} tab`}>
          <button 
            onClick={handleLaunch}
            className={`group/btn flex items-center gap-1.5 bg-gradient-to-r ${catStyles.gradient} hover:brightness-110 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring/40`}
          >
            <span>Launch</span>
            <span className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200">
              {openInNewTab ? <ExternalLink size={10} /> : <ArrowUpRight size={10} />}
            </span>
          </button>
        </Tooltip>

        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 dark:bg-black/20 border border-white/10 backdrop-blur-sm">
             <Activity size={10} className="text-emerald-400" />
             <span className="text-[10px] font-medium text-foreground truncate max-w-[70px]">{app.baseActivity.split(':')[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppItem;
