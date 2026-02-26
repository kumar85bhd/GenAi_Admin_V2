import React, { useMemo } from 'react';
import { Service } from '../types';
import AdminCard from './AdminCard';

interface AdminDashboardCardsProps {
  services: Service[];
  activeCategory: string | null;
}

/**
 * AdminDashboardCards
 * Groups services by category and renders them in a grid.
 */
const AdminDashboardCards: React.FC<AdminDashboardCardsProps> = ({ services, activeCategory }) => {
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    services.forEach(s => {
      if (!groups[s.category]) {
        groups[s.category] = [];
      }
      groups[s.category].push(s);
    });

    const sortedCategories = Object.keys(groups).sort();

    sortedCategories.forEach(cat => {
      groups[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

    return { groups, sortedCategories };
  }, [services]);

  const categoriesToRender = activeCategory
    ? [activeCategory]
    : groupedServices.sortedCategories;

  return (
    <div className="space-y-8">
      {categoriesToRender.map(cat => {
        const catServices = groupedServices.groups[cat];
        if (!catServices || catServices.length === 0) return null;

        return (
          <section key={cat}>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              {cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {catServices.map(service => (
                <AdminCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        );
      })}
      {categoriesToRender.length === 0 && (
        <div className="text-slate-500 dark:text-slate-400 text-center py-12">
          No services found for the selected category.
        </div>
      )}
    </div>
  );
};

export default AdminDashboardCards;
