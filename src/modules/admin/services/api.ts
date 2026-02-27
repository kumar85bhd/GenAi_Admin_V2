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
          { 
            id: 'auth-service', 
            name: 'Auth Service', 
            type: 'service',
            url: 'https://auth.internal.example.com',
            description: 'Centralized authentication and authorization service.'
          },
          { 
            id: 'user-service', 
            name: 'User Service', 
            type: 'service',
            url: 'https://user.internal.example.com',
            description: 'Manages user profiles and preferences.'
          }
        ]
      },
      {
        id: 'ai',
        name: 'AI Models',
        services: [
          { 
            id: 'llm-gateway', 
            name: 'LLM Gateway', 
            type: 'gateway',
            url: 'https://llm.internal.example.com',
            description: 'Unified gateway for accessing various LLM providers.'
          },
          { 
            id: 'embedding-service', 
            name: 'Embedding Service', 
            type: 'service',
            url: 'https://embed.internal.example.com',
            description: 'Generates vector embeddings for text inputs.'
          }
        ]
      },
      {
        id: 'infra',
        name: 'Infrastructure',
        services: [
          { 
            id: 'database', 
            name: 'Primary DB', 
            type: 'database',
            url: 'https://db-dashboard.internal.example.com',
            description: 'Main PostgreSQL cluster for application data.'
          },
          { 
            id: 'cache', 
            name: 'Redis Cache', 
            type: 'cache',
            url: 'https://redis-dashboard.internal.example.com',
            description: 'High-performance in-memory data store.'
          }
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
    return [
      { label: 'CPU', value: `${Math.floor(Math.random() * 20) + 5}%` },
      { label: 'Memory', value: `${Math.floor(Math.random() * 500) + 100}MB` }
    ];
  } catch (error) {
    throw error;
  }
};

