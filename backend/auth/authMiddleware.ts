import { Request, Response, NextFunction } from 'express';
import config from './config';
import { MockStrategy } from './mockStrategy';
import { JwtStrategy } from './jwtStrategy';
import { adminResolver } from './adminResolver';
import { AuthStrategy } from './authStrategy';
import winston from 'winston';

// Logger setup (Step 11 requirement integrated here for usage)
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

let strategy: AuthStrategy;

try {
  if (config.AUTH_MODE === 'jwt') {
    strategy = new JwtStrategy();
  } else {
    strategy = new MockStrategy();
  }
} catch (error) {
  logger.error('Failed to initialize auth strategy', { error });
  process.exit(1);
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid Authorization header');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    let user = await strategy.authenticate(token);
    user = adminResolver.resolve(user);
    req.user = user;
    
    logger.info('Authentication successful', { email: user.email });
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: (error as Error).message });
    res.status(401).json({ error: 'Unauthorized' });
  }
};
