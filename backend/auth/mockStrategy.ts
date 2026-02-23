import { AuthStrategy } from './authStrategy';
import { AuthUser } from './types';
import { adminResolver } from './adminResolver';

export class MockStrategy implements AuthStrategy {
  async authenticate(token: string): Promise<AuthUser> {
    if (token !== 'mock-token') {
      throw new Error('Invalid mock token');
    }

    const baseUser: AuthUser = {
      email: 'test_user@company.com',
      name: 'Test User',
      roles: ['user','admin'],
      isAdmin: true,
    };

    // Resolve admin status using the centralized resolver
    return adminResolver.resolve(baseUser);
  }
}
