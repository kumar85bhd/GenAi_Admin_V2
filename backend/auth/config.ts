import dotenv from 'dotenv';
dotenv.config();

export default {
  AUTH_MODE: process.env.AUTH_MODE || 'login',
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_key',
  JWT_PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH || './public_key.pem',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
  JWT_ISSUER: process.env.JWT_ISSUER || '',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || '',
};
