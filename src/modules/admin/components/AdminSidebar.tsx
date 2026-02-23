import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Activity, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, toggleCollapse, className = '' }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Activity, label: 'Activity', path: '/admin/activity' },
    { icon: Shield, label: 'Security', path: '/admin/security' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className={`bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} ${className}`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-tight text-white">Admin Panel</span>
        )}
        <button 
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0 transition-colors`} />
            {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavLink 
          to="/workspace"
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
          {!isCollapsed && <span className="font-medium">Exit to Workspace</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
