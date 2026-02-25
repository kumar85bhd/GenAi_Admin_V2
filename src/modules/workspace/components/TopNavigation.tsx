import React from 'react';
import { motion } from 'framer-motion';
import { Home, Star } from 'lucide-react';
import CategoryTabs from './CategoryTabs';
import { FilterType } from '../../../shared/types';

interface TopNavigationProps {
  activeFilter: FilterType;
  activeCategory: string | null;
  categories: string[];
  onNavigate: (filter: FilterType, category: string | null) => void;
  isCollapsed: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  activeFilter,
  activeCategory,
  categories,
  onNavigate,
  isCollapsed
}) => {
  return (
    <motion.nav 
      initial={false}
      animate={{
        height: isCollapsed ? 60 : 72,
        backgroundColor: isCollapsed ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: isCollapsed ? "blur(16px)" : "blur(12px)",
        borderColor: isCollapsed ? "rgba(226, 232, 240, 0.8)" : "rgba(226, 232, 240, 0.4)",
        y: isCollapsed ? 0 : 0,
        borderRadius: isCollapsed ? 16 : 24,
        paddingLeft: isCollapsed ? 16 : 24,
        paddingRight: isCollapsed ? 16 : 24,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full border border-slate-200 dark:border-slate-800 dark:bg-slate-950/80 shadow-sm z-40 transition-all duration-300 flex items-center"
    >
      <div className="w-full flex items-center justify-between">
        {/* Left Side: Primary Nav */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onNavigate('dashboard', null)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-2 ${
              activeFilter === 'dashboard' && activeCategory === null
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Home size={isCollapsed ? 18 : 16} />
            <motion.span 
              animate={{ 
                opacity: isCollapsed ? 0 : 1, 
                width: isCollapsed ? 0 : 'auto',
                marginLeft: isCollapsed ? 0 : 8
              }}
              className="overflow-hidden whitespace-nowrap"
            >
              Home
            </motion.span>
            {activeFilter === 'dashboard' && activeCategory === null && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => onNavigate('favorites', null)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-2 ${
              activeFilter === 'favorites'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Star size={isCollapsed ? 18 : 16} />
            <motion.span 
              animate={{ 
                opacity: isCollapsed ? 0 : 1, 
                width: isCollapsed ? 0 : 'auto',
                marginLeft: isCollapsed ? 0 : 8
              }}
              className="overflow-hidden whitespace-nowrap"
            >
              Favorites
            </motion.span>
            {activeFilter === 'favorites' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
          
          {/* Categories */}
          <CategoryTabs 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelectCategory={(cat) => onNavigate('dashboard', cat)} 
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavigation;
