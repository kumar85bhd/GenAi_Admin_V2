import { AppData, AppMetric } from '../types';

export const api = {
  login: async (): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  getConfig: async (): Promise<{ cardsPerRow: number }> => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        return await res.json();
      }
      return { cardsPerRow: 4 };
    } catch (error) {
      console.error('Failed to fetch config', error);
      return { cardsPerRow: 4 };
    }
  },

  getApps: async (): Promise<{ data: AppData[], isLive: boolean }> => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/apps', {
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
      await fetch(`/api/apps/${id}/favorite`, {
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
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/metrics/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return { data };
      }
    } catch (error) {
      console.error(`Failed to fetch metrics for app ${id}`, error);
    }
    
    // Fallback if API fails
    return {
      data: {
        name: 'Efficiency Score',
        value: '94/100',
        trend: 'up'
      }
    };
  },

  getPreferences: async (): Promise<{ theme: string, favorites: number[] } | null> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const res = await fetch('/api/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch preferences', error);
      return null;
    }
  },

  updateTheme: async (theme: string): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await fetch('/api/preferences/theme', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme })
      });
    } catch (error) {
      console.error('Failed to update theme', error);
    }
  },

  updateFavorites: async (favorites: number[]): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await fetch('/api/preferences/favorites', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites })
      });
    } catch (error) {
      console.error('Failed to update favorites', error);
    }
  }
};
