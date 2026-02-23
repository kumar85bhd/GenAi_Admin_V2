import { AppData, AppMetric } from '../types';

const MOCK_APPS: AppData[] = [
  {
    id: 1,
    name: 'AI Writer',
    desc: 'Generate high-quality content for your blog, social media, and more with advanced language models.',
    category: 'Productivity',
    isFavorite: true,
    baseActivity: '1.2k Uses',
    icon: 'FileText',
    url: '#',
    metrics: '98% Satisfaction',
    status: 'Active',
    lastUsed: '2 hours ago'
  },
  {
    id: 2,
    name: 'Knowledge Base',
    desc: 'Centralized repository for all your team\'s documentation and insights, powered by semantic search.',
    category: 'Knowledge',
    isFavorite: false,
    baseActivity: '850 Queries',
    icon: 'Book',
    url: '#',
    metrics: '4.5/5 Rating',
    status: 'Active',
    lastUsed: '1 day ago'
  },
  {
    id: 3,
    name: 'Customer Insights',
    desc: 'Analyze customer feedback and sentiment to improve your products and services.',
    category: 'Customer',
    isFavorite: true,
    baseActivity: '3.4k Analyzed',
    icon: 'MessageSquare',
    url: '#',
    metrics: '92% Accuracy',
    status: 'Active',
    lastUsed: '30 mins ago'
  },
  {
    id: 4,
    name: 'Platform Analytics',
    desc: 'Real-time monitoring and analytics for your AI infrastructure and model performance.',
    category: 'Platform',
    isFavorite: false,
    baseActivity: '99.9% Uptime',
    icon: 'BarChart3',
    url: '#',
    metrics: '12ms Latency',
    status: 'Active',
    lastUsed: '5 mins ago'
  },
  {
    id: 5,
    name: 'Code Assistant',
    desc: 'Intelligent code completion and refactoring tool to boost developer productivity.',
    category: 'Productivity',
    isFavorite: true,
    baseActivity: '5k Snippets',
    icon: 'Code',
    url: '#',
    metrics: '2x Speedup',
    status: 'Active',
    lastUsed: 'Just now'
  },
  {
    id: 6,
    name: 'Image Generator',
    desc: 'Create stunning visuals from text descriptions using state-of-the-art diffusion models.',
    category: 'Productivity',
    isFavorite: false,
    baseActivity: '450 Images',
    icon: 'Palette',
    url: '#',
    metrics: '4k Resolution',
    status: 'Active',
    lastUsed: '3 days ago'
  },
  {
    id: 7,
    name: 'Security Shield',
    desc: 'Protect your AI models and data from adversarial attacks and unauthorized access.',
    category: 'Platform',
    isFavorite: false,
    baseActivity: '0 Threats',
    icon: 'Shield',
    url: '#',
    metrics: '100% Secure',
    status: 'Active',
    lastUsed: '1 week ago'
  },
  {
    id: 8,
    name: 'Trend Forecaster',
    desc: 'Predict market trends and consumer behavior with predictive analytics.',
    category: 'Knowledge',
    isFavorite: false,
    baseActivity: '12 Reports',
    icon: 'TrendingUp',
    url: '#',
    metrics: '85% Precision',
    status: 'Active',
    lastUsed: '4 days ago'
  }
];

export const api = {
  login: async (): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  getApps: async (): Promise<{ data: AppData[], isLive: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: MOCK_APPS, isLive: true };
  },

  toggleFavorite: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Toggled favorite for app ${id}`);
  },

  getMetrics: async (id: number): Promise<{ data: AppMetric }> => {
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
