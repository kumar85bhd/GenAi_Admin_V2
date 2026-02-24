import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import authConfig from './config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    let publicKey = authConfig.JWT_SECRET; // fallback
    if (authConfig.JWT_ALGORITHM === 'RS256') {
      const keyPath = path.resolve(process.cwd(), authConfig.JWT_PUBLIC_KEY_PATH || './public_key.pem');
      if (fs.existsSync(keyPath)) {
        publicKey = fs.readFileSync(keyPath, 'utf8');
      } else {
        console.warn(`Public key not found at ${keyPath}`);
      }
    }

    const decoded = jwt.verify(token, publicKey, {
      algorithms: [authConfig.JWT_ALGORITHM as jwt.Algorithm],
      issuer: authConfig.JWT_ISSUER || undefined,
      audience: authConfig.JWT_AUDIENCE || undefined,
    }) as any;
    
    // Check roles
    const adminUsersPath = path.resolve(process.cwd(), 'backend/auth/admin_users.json');
    let roles = ['user'];
    if (fs.existsSync(adminUsersPath)) {
      try {
        const adminData = JSON.parse(fs.readFileSync(adminUsersPath, 'utf8'));
        if (adminData.admins && adminData.admins.includes(decoded.email)) {
          roles.push('admin');
        }
      } catch (e) {
        console.error('Error reading admin_users.json', e);
      }
    }
    
    decoded.roles = roles;
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
