import fs from 'fs';
import path from 'path';
import { AuthUser } from './types';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

interface AdminConfig {
  admins: string[];
}

class AdminResolver {
  private adminEmails: Set<string>;

  constructor() {
    this.adminEmails = new Set();
    this.loadAdmins();
  }

  private loadAdmins() {
    try {
      // Load from backend/auth/admin_users.json as per original structure
      const configPath = path.resolve(process.cwd(), 'backend', 'auth', 'admin_users.json');
      if (fs.existsSync(configPath)) {
        const rawData = fs.readFileSync(configPath, 'utf-8');
        const config: AdminConfig = JSON.parse(rawData);
        if (Array.isArray(config.admins)) {
          config.admins.forEach(email => this.adminEmails.add(email.toLowerCase().trim()));
        }
      } else {
        logger.warn('admin_users.json not found, skipping admin resolution');
      }
    } catch (error) {
      logger.error('Failed to load admin_users.json', { error });
    }
  }

  resolveAdmin(email: string): boolean {
    if (!email) return false;
    return this.adminEmails.has(email.toLowerCase().trim());
  }

  resolve(user: AuthUser): AuthUser {
    const isAdmin = this.resolveAdmin(user.email);
    if (isAdmin) {
      const roles = user.roles.includes('admin') ? user.roles : [...user.roles, 'admin'];
      return {
        ...user,
        roles,
        isAdmin: true,
      };
    }
    return {
      ...user,
      isAdmin: false,
    };
  }
}

export const adminResolver = new AdminResolver();
