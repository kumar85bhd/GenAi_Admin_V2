import { AppData, AppMetric } from '../types';

export const api = {
  login: async (): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  getApps: async (): Promise<{ data: AppData[], isLive: boolean }> => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/apps', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return { data, isLive: true };
      }
      return { data: [], isLive: false };
    } catch (error) {
      console.error('Failed to fetch apps', error);
      return { data: [], isLive: false };
    }
  },

  toggleFavorite: async (id: number | string): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`/apps/${id}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Failed to toggle favorite for app ${id}`, error);
    }
  },

  getMetrics: async (id: number | string): Promise<{ data: AppMetric }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        name: 'Efficiency Score',
        value: '94/100',
        trend: 'up'
      }
    };
  }
};
