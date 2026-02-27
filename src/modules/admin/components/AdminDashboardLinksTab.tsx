import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Check, X, Link as LinkIcon, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { ToastType } from '../../../shared/components/Toast';
import { Tooltip } from '../../../shared/components/ui/Tooltip';

interface DashboardLink {
  id: string;
  name: string;
  slug: string;
  icon: string;
  url: string;
  display_order: number;
  is_active: boolean;
}

interface AdminDashboardLinksTabProps {
  addToast: (message: string, type?: ToastType) => void;
}

const AdminDashboardLinksTab: React.FC<AdminDashboardLinksTabProps> = ({ addToast }) => {
  const [links, setLinks] = useState<DashboardLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DashboardLink>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof DashboardLink; direction: 'asc' | 'desc' } | null>(null);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/admin/dashboard-links', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard links');
      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      setError(err.message);
      addToast('Failed to fetch dashboard links', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const validateForm = (form: Partial<DashboardLink>) => {
    if (!form.name) {
      addToast('Name is required', 'error');
      return false;
    }
    if (!form.url) {
      addToast('URL is required', 'error');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm(editForm)) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/admin/dashboard-links', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create dashboard link');
      }
      setIsCreating(false);
      setEditForm({});
      fetchLinks();
      addToast('Dashboard link created successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!validateForm(editForm)) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/admin/dashboard-links/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update dashboard link');
      }
      setIsEditing(null);
      setEditForm({});
      fetchLinks();
      addToast('Dashboard link updated successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/admin/dashboard-links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete dashboard link');
      }
      fetchLinks();
      setIsDeleting(null);
      addToast('Dashboard link deleted successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    }
  };

  const startEdit = (link: DashboardLink) => {
    setIsEditing(link.id);
    setEditForm(link);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setIsEditing(null);
    setEditForm({
      name: '',
      icon: 'Link',
      url: '',
      display_order: 0,
      is_active: true
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsCreating(false);
    setEditForm({});
  };

  const handleSort = (key: keyof DashboardLink) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLinks = React.useMemo(() => {
    if (!sortConfig) return links;
    return [...links].sort((a, b) => {
      // @ts-ignore
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      // @ts-ignore
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [links, sortConfig]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-20">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Admin Dashboard Links</h3>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Icon Reference</span>
                <Tooltip content="Refer to lucide.dev/icons for icon names" position="bottom">
                    <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors">
                        <Info size={16} />
                    </a>
                </Tooltip>
            </div>
            <button 
              onClick={startCreate}
              disabled={isCreating}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              Add Dashboard Link
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading dashboard links...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 sticky top-0 z-10">
                <tr>
                  <th 
                    className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortConfig?.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium">Icon</th>
                  <th className="px-4 py-3 font-medium">URL</th>
                  <th 
                    className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => handleSort('display_order')}
                  >
                    <div className="flex items-center gap-1">
                      Order
                      {sortConfig?.key === 'display_order' && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">Active</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {isCreating && (
                  <tr className="bg-indigo-50/50 dark:bg-indigo-900/10">
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Link Name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={editForm.icon || ''} 
                        onChange={e => setEditForm({...editForm, icon: e.target.value})}
                        className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Icon Name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={editForm.url || ''} 
                        onChange={e => setEditForm({...editForm, url: e.target.value})}
                        className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="URL"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={editForm.display_order || 0} 
                        onChange={e => setEditForm({...editForm, display_order: parseInt(e.target.value)})}
                        className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={!!editForm.is_active} 
                        onChange={e => setEditForm({...editForm, is_active: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={handleCreate} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={18} /></button>
                        <button onClick={cancelEdit} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )}

                {sortedLinks.map(link => {
                  const editing = isEditing === link.id;
                  return (
                    <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        {editing ? (
                          <input 
                            type="text" 
                            value={editForm.name || ''} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="font-medium text-slate-900 dark:text-white">{link.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <input 
                            type="text" 
                            value={editForm.icon || ''} 
                            onChange={e => setEditForm({...editForm, icon: e.target.value})}
                            className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-slate-500 font-mono text-xs">{link.icon}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <input 
                            type="text" 
                            value={editForm.url || ''} 
                            onChange={e => setEditForm({...editForm, url: e.target.value})}
                            className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-slate-500 truncate max-w-[150px] block" title={link.url}>{link.url}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <input 
                            type="number" 
                            value={editForm.display_order || 0} 
                            onChange={e => setEditForm({...editForm, display_order: parseInt(e.target.value)})}
                            className="w-full px-2 py-1 border rounded dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-slate-500">{link.display_order}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editing ? (
                          <input 
                            type="checkbox" 
                            checked={!!editForm.is_active} 
                            onChange={e => setEditForm({...editForm, is_active: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${link.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {link.is_active ? 'Yes' : 'No'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleUpdate(link.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={18} /></button>
                            <button onClick={cancelEdit} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X size={18} /></button>
                          </div>
                        ) : isDeleting === link.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-500 mr-2 font-medium">Delete?</span>
                            <button onClick={() => handleDelete(link.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Check size={18} /></button>
                            <button onClick={() => setIsDeleting(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X size={18} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(link)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => setIsDeleting(link.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                
                {links.length === 0 && !isCreating && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No dashboard links found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardLinksTab;
