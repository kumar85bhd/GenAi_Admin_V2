import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware, adminRoutes } from './backend';
import authConfig from './backend/auth/config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate RSA keys if they don't exist
const publicKeyPath = path.resolve(process.cwd(), authConfig.JWT_PUBLIC_KEY_PATH || './public_key.pem');
const privateKeyPath = path.resolve(process.cwd(), './private_key.pem');

if (authConfig.JWT_ALGORITHM === 'RS256' && (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath))) {
  console.log('Generating RSA key pair for RS256 JWT authentication...');
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  fs.writeFileSync(publicKeyPath, publicKey);
  fs.writeFileSync(privateKeyPath, privateKey);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory "DB" for user preferences
  const userPreferences: Record<string, { theme: string, favorites: number[] }> = {};

  const getPrefs = (email: string) => {
    if (!userPreferences[email]) {
      userPreferences[email] = { theme: 'dark', favorites: [] };
    }
    return userPreferences[email];
  };

  const CONFIG_PATH = path.join(process.cwd(), 'config.json');

  const loadConfig = () => {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      }
    } catch (e) {
      console.error('Error loading config:', e);
    }
    return { apps: [] };
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', live: true });
  });

  app.get('/api/auth/config', (req, res) => {
    res.json({ mode: authConfig.AUTH_MODE, algorithm: authConfig.JWT_ALGORITHM });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const usersPath = path.join(__dirname, 'backend', 'auth', 'users.json');
    try {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        let privateKey = authConfig.JWT_SECRET;
        if (authConfig.JWT_ALGORITHM === 'RS256') {
          privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        }
        
        const token = jwt.sign(
          { email: user.email, name: user.name },
          privateKey,
          { 
            expiresIn: '7d',
            algorithm: authConfig.JWT_ALGORITHM as jwt.Algorithm,
            ...(authConfig.JWT_ISSUER ? { issuer: authConfig.JWT_ISSUER } : {}),
            ...(authConfig.JWT_AUDIENCE ? { audience: authConfig.JWT_AUDIENCE } : {})
          }
        );
        res.json({
          access_token: token,
          token_type: 'bearer'
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json(req.user);
  });

  // Preferences Routes
  app.get('/api/preferences', authMiddleware, (req, res) => {
    const email = req.user.email;
    res.json(getPrefs(email));
  });

  app.put('/api/preferences/theme', authMiddleware, (req, res) => {
    const email = req.user.email;
    const { theme } = req.body;
    getPrefs(email).theme = theme;
    res.json(getPrefs(email));
  });

  app.put('/api/preferences/favorites', authMiddleware, (req, res) => {
    const email = req.user.email;
    const { favorites } = req.body;
    getPrefs(email).favorites = favorites;
    res.json(getPrefs(email));
  });

  // Protected Routes
  app.get('/api/apps', authMiddleware, (req, res) => {
    const config = loadConfig();
    const prefs = getPrefs(req.user.email);
    const favSet = new Set(prefs.favorites);
    const apps = config.apps.map((app: any) => ({
      ...app,
      isFavorite: favSet.has(app.id)
    }));
    res.json(apps);
  });

  app.post('/api/apps/:id/favorite', authMiddleware, (req, res) => {
    const appId = parseInt(req.params.id as string);
    const prefs = getPrefs(req.user.email);
    const favSet = new Set(prefs.favorites);
    let action = '';
    if (favSet.has(appId)) {
      favSet.delete(appId);
      action = 'removed';
    } else {
      favSet.add(appId);
      action = 'added';
    }
    prefs.favorites = Array.from(favSet);
    res.json({ status: 'success', action, isFavorite: favSet.has(appId) });
  });

  app.get('/api/metrics/:id', authMiddleware, (req, res) => {
    const appId = parseInt(req.params.id as string);
    const metricsMap: Record<number, any> = {
      1: { name: "Meetings Saved", value: `${Math.floor(Math.random() * 12) + 12} hrs`, trend: "up" },
      2: { name: "Docs Indexed", value: `${Math.floor(Math.random() * 4000) + 1000}`, trend: "up" },
      12: { name: "Assets Gen", value: Math.floor(Math.random() * 60) + 40, trend: "up" }
    };
    const metric = metricsMap[appId] || { name: "Uptime", value: "100%", trend: "neutral" };
    res.json(metric);
  });

  // Admin Routes
  app.use('/admin', authMiddleware, adminRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

