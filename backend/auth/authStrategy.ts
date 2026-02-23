import { AuthUser } from './types';

export interface AuthStrategy {
  authenticate(token: string): Promise<AuthUser>;
}
