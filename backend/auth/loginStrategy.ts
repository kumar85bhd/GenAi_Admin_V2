import { AuthStrategy } from './authStrategy';
import { AuthUser } from './types';
import jwt from 'jsonwebtoken';
import config from './config';

export class LoginStrategy implements AuthStrategy {
  async authenticate(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      return {
        email: decoded.email,
        name: decoded.name || null,
        roles: decoded.roles || ['user'],
        isAdmin: false,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
