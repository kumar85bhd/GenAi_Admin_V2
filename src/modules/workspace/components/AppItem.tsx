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

// Highlight palettes for dynamic assignment
const highlightPalettes = [
  { bg: 'bg-indigo-500/10', text: 'text-indigo-500 dark:text-indigo-400', border: 'group-hover:border-indigo-500/50', shadow: 'group-hover:shadow-indigo-500/20', gradient: 'from-indigo-500 to-blue-600' },
  { bg: 'bg-violet-500/10', text: 'text-violet-500 dark:text-violet-400', border: 'group-hover:border-violet-500/50', shadow: 'group-hover:shadow-violet-500/20', gradient: 'from-violet-500 to-purple-600' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-500 dark:text-cyan-400', border: 'group-hover:border-cyan-500/50', shadow: 'group-hover:shadow-cyan-500/20', gradient: 'from-cyan-400 to-blue-500' },
  { bg: 'bg-teal-500/10', text: 'text-teal-500 dark:text-teal-400', border: 'group-hover:border-teal-500/50', shadow: 'group-hover:shadow-teal-500/20', gradient: 'from-teal-400 to-emerald-500' },
  { bg: 'bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400', border: 'group-hover:border-amber-500/50', shadow: 'group-hover:shadow-amber-500/20', gradient: 'from-amber-400 to-orange-500' },
  { bg: 'bg-red-500/10', text: 'text-red-500 dark:text-red-400', border: 'group-hover:border-red-500/50', shadow: 'group-hover:shadow-red-500/20', gradient: 'from-red-500 to-rose-600' },
  { bg: 'bg-lime-500/10', text: 'text-lime-500 dark:text-lime-400', border: 'group-hover:border-lime-500/50', shadow: 'group-hover:shadow-lime-500/20', gradient: 'from-lime-400 to-green-500' },
  // Gray is considered last
  { bg: 'bg-slate-500/10', text: 'text-slate-500 dark:text-slate-400', border: 'group-hover:border-slate-500/50', shadow: 'group-hover:shadow-slate-500/20', gradient: 'from-slate-400 to-slate-600' }
];

// Category styling helper - Semantic Colors
const getCategoryStyles = (category: string) => {
  // Hash string to pick a consistent highlight color
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use highlightPalettes.length - 1 to exclude the last gray item from normal assignment
  const index = Math.abs(hash) % (highlightPalettes.length - 1);
  return highlightPalettes[index];
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
