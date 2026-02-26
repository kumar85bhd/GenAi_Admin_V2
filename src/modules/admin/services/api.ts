import { AppConfig } from '../types';

export const fetchConfig = async (): Promise<AppConfig> => {
  return {
    platformName: 'Agentic Admin',
    environment: 'Production',
    refreshIntervals: [15000, 30000, 60000],
    categories: [
      {
        id: 'core',
        name: 'Core Services',
        services: [
          { id: 'auth-service', name: 'Auth Service', type: 'service' },
          { id: 'user-service', name: 'User Service', type: 'service' }
        ]
      },
      {
        id: 'ai',
        name: 'AI Models',
        services: [
          { id: 'llm-gateway', name: 'LLM Gateway', type: 'gateway' },
          { id: 'embedding-service', name: 'Embedding Service', type: 'service' }
        ]
      },
      {
        id: 'infra',
        name: 'Infrastructure',
        services: [
          { id: 'database', name: 'Primary DB', type: 'database' },
          { id: 'cache', name: 'Redis Cache', type: 'cache' }
        ]
      }
    ]
  };
};

export const fetchHealthData = async () => {
  // Mock implementation
  return {};
};

