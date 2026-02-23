import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface AuthConfig {
  AUTH_MODE: 'login' | 'sso';
  JWT_PUBLIC_KEY_PATH?: string;
  JWT_ISSUER?: string;
  JWT_AUDIENCE?: string;
  JWT_ALGORITHM: string;
  JWT_SECRET: string;
}

const getAuthMode = (): 'login' | 'sso' => {
  const mode = process.env.AUTH_MODE || 'login';
  if (mode !== 'login' && mode !== 'sso') {
    console.warn(`Invalid AUTH_MODE '${mode}', defaulting to 'login'`);
    return 'login';
  }
  return mode as 'login' | 'sso';
};

const config: AuthConfig = {
  AUTH_MODE: getAuthMode(),
  JWT_PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'RS256',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key-for-login-mode',
};

if (config.AUTH_MODE === 'sso' && !config.JWT_PUBLIC_KEY_PATH) {
  throw new Error('JWT_PUBLIC_KEY_PATH is required when AUTH_MODE is set to sso');
}

export default config;
