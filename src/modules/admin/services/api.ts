import { AppConfig, Metric } from '../types';

export const fetchConfig = async (): Promise<AppConfig> => {
  return {
    platformName: 'Infrastructure Console',
    environment: 'Production',
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

/**
 * Fetches metrics for a specific service.
 * Uses try/catch to handle potential endpoint failures.
 */
export const fetchServiceMetrics = async (serviceId: string): Promise<Metric[]> => {
  try {
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { label: 'CPU', value: `${Math.floor(Math.random() * 20) + 5}%` },
      { label: 'Memory', value: `${Math.floor(Math.random() * 500) + 100}MB` }
    ];
  } catch (error) {
    throw error;
  }
};

