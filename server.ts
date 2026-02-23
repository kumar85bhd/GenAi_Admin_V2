import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware, adminRoutes } from './backend';
import authConfig from './backend/auth/config';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory "DB" for favorites
  let favorites = new Set([1, 2, 3, 12]);
  
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
    res.json({ mode: authConfig.AUTH_MODE });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const usersPath = path.join(__dirname, 'backend', 'auth', 'users.json');
    try {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        const token = jwt.sign({ email: user.email, name: user.name }, authConfig.JWT_SECRET, { expiresIn: '1h' });
        res.json({
          access_token: token,
          token_type: 'bearer'
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error reading users.json', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json(req.user);
  });

  // Protected Routes
  app.get('/api/apps', authMiddleware, (req, res) => {
    const config = loadConfig();
    const apps = config.apps.map((app: any) => ({
      ...app,
      isFavorite: favorites.has(app.id)
    }));
    res.json(apps);
  });

  app.post('/api/apps/:id/favorite', authMiddleware, (req, res) => {
    const appId = parseInt(req.params.id as string);
    let action = '';
    if (favorites.has(appId)) {
      favorites.delete(appId);
      action = 'removed';
    } else {
      favorites.add(appId);
      action = 'added';
    }
    res.json({ status: 'success', action, isFavorite: favorites.has(appId) });
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
