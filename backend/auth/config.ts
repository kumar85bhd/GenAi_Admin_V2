import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface AuthConfig {
  AUTH_MODE: 'mock' | 'jwt';
  JWT_PUBLIC_KEY_PATH?: string;
  JWT_ISSUER?: string;
  JWT_AUDIENCE?: string;
  JWT_ALGORITHM: string;
}

const getAuthMode = (): 'mock' | 'jwt' => {
  const mode = process.env.AUTH_MODE || 'mock';
  if (mode !== 'mock' && mode !== 'jwt') {
    console.warn(`Invalid AUTH_MODE '${mode}', defaulting to 'mock'`);
    return 'mock';
  }
  return mode;
};

const config: AuthConfig = {
  AUTH_MODE: getAuthMode(),
  JWT_PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'RS256',
};

if (config.AUTH_MODE === 'jwt' && !config.JWT_PUBLIC_KEY_PATH) {
  throw new Error('JWT_PUBLIC_KEY_PATH is required when AUTH_MODE is set to jwt');
}

export default config;
