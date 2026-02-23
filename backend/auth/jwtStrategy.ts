import jwt, { JwtPayload, Algorithm } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { AuthStrategy } from './authStrategy';
import { AuthUser } from './types';
import config from './config';

export class JwtStrategy implements AuthStrategy {
  private publicKey: string | Buffer;

  constructor() {
    if (!config.JWT_PUBLIC_KEY_PATH) {
      throw new Error('JWT_PUBLIC_KEY_PATH is not defined');
    }
    try {
      // Resolve path relative to project root if needed, or absolute
      const keyPath = path.resolve(process.cwd(), config.JWT_PUBLIC_KEY_PATH);
      this.publicKey = fs.readFileSync(keyPath);
    } catch (error) {
      console.error(`Failed to load public key from ${config.JWT_PUBLIC_KEY_PATH}:`, error);
      throw error;
    }
  }

  async authenticate(token: string): Promise<AuthUser> {
    try {
      const verifyOptions: jwt.VerifyOptions = {
        algorithms: [config.JWT_ALGORITHM as Algorithm],
      };

      if (config.JWT_ISSUER) {
        verifyOptions.issuer = config.JWT_ISSUER;
      }

      if (config.JWT_AUDIENCE) {
        verifyOptions.audience = config.JWT_AUDIENCE;
      }

      const decoded = jwt.verify(token, this.publicKey, verifyOptions) as JwtPayload;

      if (!decoded || typeof decoded !== 'object') {
        throw new Error('Invalid token payload');
      }

      const email = decoded.email;
      if (!email) {
        throw new Error('Token missing email claim');
      }

      return {
        email: email,
        name: decoded.name || null,
        roles: ['user'],
        isAdmin: false,
      };
    } catch (error) {
      throw new Error(`JWT verification failed: ${(error as Error).message}`);
    }
  }
}
