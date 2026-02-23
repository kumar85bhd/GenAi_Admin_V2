import { Request, Response, NextFunction } from 'express';
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

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    logger.warn('Admin access attempt without user context');
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  if (req.user.isAdmin !== true) {
    logger.warn('Admin access attempt by non-admin user', { email: req.user.email });
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  logger.info('Admin access granted', { email: req.user.email });
  next();
};
