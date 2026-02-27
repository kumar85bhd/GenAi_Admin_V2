import React, { useState } from 'react';
import { ToastType } from '../../../shared/components/Toast';
import WorkspaceAppsTab from './WorkspaceAppsTab';
import AdminDashboardLinksTab from './AdminDashboardLinksTab';
import ManageCategoriesTab from './ManageCategoriesTab';

interface AdminApplicationsPageProps {
  addToast: (message: string, type?: ToastType) => void;
}

const AdminApplicationsPage: React.FC<AdminApplicationsPageProps> = ({ addToast }) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'links' | 'categories'>('apps');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'apps'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Workspace Applications
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'links'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Admin Dashboard Links
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'categories'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Manage Categories
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'apps' && <WorkspaceAppsTab addToast={addToast} />}
        {activeTab === 'links' && <AdminDashboardLinksTab addToast={addToast} />}
        {activeTab === 'categories' && <ManageCategoriesTab addToast={addToast} />}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
