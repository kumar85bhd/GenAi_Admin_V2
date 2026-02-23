import { Request } from 'express';

export interface AuthUser {
  email: string;
  name: string | null;
  roles: string[];
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
