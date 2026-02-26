import React from 'react';

interface AdminSidebarProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

/**
 * AdminSidebar
 * Renders a left sidebar for filtering infrastructure dashboards by category.
 */
const AdminSidebar: React.FC<AdminSidebarProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <aside className="hidden md:flex flex-col w-[220px] border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 h-full overflow-y-auto shrink-0">
      <div className="p-4 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
        Categories
      </div>
      <nav className="p-3 space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            activeCategory === null
              ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 font-medium'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Services
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeCategory === cat
                ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
