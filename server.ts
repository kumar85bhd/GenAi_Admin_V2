import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware, adminRoutes } from './backend/index.ts';
import authConfig from './backend/auth/config.ts';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from './backend/db.ts';

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

// Seed DB if empty
const seedDb = () => {
  const appCount = db.prepare('SELECT COUNT(*) as count FROM apps').get() as { count: number };
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };

  if (appCount.count === 0 || catCount.count === 0) {
    const CONFIG_PATH = path.join(process.cwd(), 'config.json');
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      const apps = config.apps || [];

      // Seed Categories first
      if (catCount.count === 0) {
        const uniqueCategories = new Set(apps.map((app: any) => app.category));
        const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, icon) VALUES (@name, @icon)');
        const insertManyCats = db.transaction((cats) => {
          for (const cat of cats) {
            insertCategory.run({ name: cat, icon: 'Folder' });
          }
        });
        insertManyCats(Array.from(uniqueCategories));
        console.log(`Seeded ${uniqueCategories.size} categories from config.`);
      }

      // Seed Apps
      if (appCount.count === 0) {
        const insert = db.prepare(`
          INSERT INTO apps (name, category, icon, url, description, base_activity, metrics_enabled, metric_name, metric_value, is_active)
          VALUES (@name, @category, @icon, @url, @description, @baseActivity, @metricsEnabled, @metricName, @metricValue, @isActive)
        `);
        
        const insertMany = db.transaction((apps) => {
          for (const app of apps) {
            insert.run({
              name: app.name,
              category: app.category,
              icon: app.icon || 'Box',
              url: app.url || '#',
              description: app.desc || '',
              baseActivity: app.baseActivity || '',
              metricsEnabled: app.metricsEnabled ? 1 : 0,
              metricName: app.metricName || null,
              metricValue: app.metricValue || null,
              isActive: 1
            });
          }
        });
        
        insertMany(apps);
        console.log(`Seeded ${apps.length} apps from config.`);
      }
    }
  }
};
seedDb();

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
          { email: user.email, name: user.name, role: user.role || 'user' },
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

  app.get('/api/config', authMiddleware, (req, res) => {
    const config = loadConfig();
    let cardsPerRow = config.uiConfig?.cardsPerRow || 4;
    // Enforce 3 or 4
    if (cardsPerRow !== 3 && cardsPerRow !== 4) {
      cardsPerRow = 4;
    }
    res.json({ cardsPerRow });
  });

  // Protected Routes
  app.get('/api/apps', authMiddleware, (req, res) => {
    try {
      const dbApps = db.prepare('SELECT * FROM apps WHERE is_active = 1').all() as any[];
      const prefs = getPrefs(req.user.email);
      const favSet = new Set(prefs.favorites);
      
      const apps = dbApps.map(app => ({
        id: app.id,
        name: app.name,
        category: app.category,
        icon: app.icon,
        url: app.url,
        desc: app.description,
        keyFeatures: app.key_features || '',
        baseActivity: app.base_activity || '',
        metricsEnabled: Boolean(app.metrics_enabled),
        metricName: app.metric_name,
        metricValue: app.metric_value,
        isFavorite: favSet.has(app.id),
        metrics: app.metric_value || '',
        status: app.is_active ? 'Active' : 'Inactive',
        lastUsed: 'Just now'
      }));
      
      res.json(apps);
    } catch (error) {
      console.error('Error fetching apps:', error);
      res.status(500).json({ error: 'Failed to fetch apps' });
    }
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

  // Admin App CRUD Routes
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin role required' });
    }
    next();
  };

  app.get('/api/admin/apps', authMiddleware, requireAdmin, (req, res) => {
    try {
      console.log('Fetching admin apps for user:', req.user.email);
      const apps = db.prepare('SELECT * FROM apps ORDER BY name ASC').all();
      console.log(`Found ${apps.length} apps`);
      res.json(apps);
    } catch (error) {
      console.error('Error fetching admin apps:', error);
      res.status(500).json({ error: 'Failed to fetch apps' });
    }
  });

  app.post('/api/admin/apps', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { name, category, icon, url, description, key_features, is_active, metrics_enabled } = req.body;
      
      if (!name || name.length > 50) {
        return res.status(400).json({ error: 'Name must be less than 50 characters' });
      }
      
      // URL Validation
      if (url && !url.match(/^https?:\/\/.+/)) {
        return res.status(400).json({ error: 'URL must start with http:// or https://' });
      }
      
      const insert = db.prepare(`
        INSERT INTO apps (name, category, icon, url, description, key_features, is_active, metrics_enabled)
        VALUES (@name, @category, @icon, @url, @description, @keyFeatures, @isActive, @metricsEnabled)
      `);
      
      const result = insert.run({
        name,
        category: category || 'Uncategorized',
        icon: icon || 'Box',
        url: url || '#',
        description: description || '',
        keyFeatures: key_features || '',
        isActive: (is_active === 1 || is_active === true || is_active === '1') ? 1 : 0,
        metricsEnabled: (metrics_enabled === 1 || metrics_enabled === true || metrics_enabled === '1') ? 1 : 0
      });
      
      res.status(201).json({ id: result.lastInsertRowid, message: 'App created successfully' });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'App name must be unique' });
      }
      res.status(500).json({ error: 'Failed to create app' });
    }
  });

  app.put('/api/admin/apps/:id', authMiddleware, requireAdmin, (req, res) => {
    try {
      const id = req.params.id;
      const { name, category, icon, url, description, key_features, is_active, metrics_enabled } = req.body;
      
      if (!name || name.length > 50) {
        return res.status(400).json({ error: 'Name must be less than 50 characters' });
      }

      // URL Validation
      if (url && !url.match(/^https?:\/\/.+/)) {
        return res.status(400).json({ error: 'URL must start with http:// or https://' });
      }
      
      const update = db.prepare(`
        UPDATE apps 
        SET name = @name, category = @category, icon = @icon, url = @url, 
            description = @description, key_features = @keyFeatures, is_active = @isActive, metrics_enabled = @metricsEnabled,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `);
      
      const result = update.run({
        id,
        name,
        category: category || 'Uncategorized',
        icon: icon || 'Box',
        url: url || '#',
        description: description || '',
        keyFeatures: key_features || '',
        isActive: (is_active === 1 || is_active === true || is_active === '1') ? 1 : 0,
        metricsEnabled: (metrics_enabled === 1 || metrics_enabled === true || metrics_enabled === '1') ? 1 : 0
      });
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      res.json({ message: 'App updated successfully' });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'App name must be unique' });
      }
      res.status(500).json({ error: 'Failed to update app' });
    }
  });

  app.delete('/api/admin/apps/:id', authMiddleware, requireAdmin, (req, res) => {
    try {
      const id = req.params.id;
      const result = db.prepare('DELETE FROM apps WHERE id = ?').run(id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'App not found' });
      }
      
      res.json({ message: 'App deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete app' });
    }
  });

  // Category Management
  app.get('/api/admin/categories', authMiddleware, requireAdmin, (req, res) => {
    try {
      const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.post('/api/admin/categories', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { name, icon } = req.body;
      if (!name || name.length > 50 || !name.match(/^[a-zA-Z0-9 &_-]+$/)) {
        return res.status(400).json({ error: 'Invalid category name.' });
      }
      const result = db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)')
        .run(name, icon || 'Folder');
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Category name must be unique.' });
      }
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.put('/api/admin/categories/:id', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { name, icon } = req.body;
      const id = req.params.id;
      if (!name || name.length > 50 || !name.match(/^[a-zA-Z0-9 &_-]+$/)) {
        return res.status(400).json({ error: 'Invalid category name.' });
      }
      const result = db.prepare('UPDATE categories SET name = ?, icon = ? WHERE id = ?')
        .run(name, icon || 'Folder', id);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category updated' });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Category name must be unique.' });
      }
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/api/admin/categories/:id', authMiddleware, requireAdmin, (req, res) => {
    try {
      const id = req.params.id;
      // Check if any app is using this category
      const app = db.prepare('SELECT 1 FROM apps WHERE category = (SELECT name FROM categories WHERE id = ?)')
        .get(id);

      if (app) {
        return res.status(400).json({ error: 'Cannot delete category: it is currently in use by an application.' });
      }

      const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // Admin Dashboard Links Management (JSON-backed)
  const ADMIN_CONFIG_PATH = path.join(process.cwd(), 'admin_config.json');

  const loadAdminConfig = () => {
    try {
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, 'utf-8'));
      }
    } catch (e) {
      console.error('Error loading admin config:', e);
    }
    return { dashboard_links: [], metrics: [] };
  };

  const saveAdminConfig = (config: any) => {
    const tempPath = `${ADMIN_CONFIG_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(config, null, 2));
    fs.renameSync(tempPath, ADMIN_CONFIG_PATH);
  };

  app.get('/api/admin/dashboard-links', authMiddleware, requireAdmin, (req, res) => {
    try {
      const config = loadAdminConfig();
      res.json(config.dashboard_links || []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard links' });
    }
  });

  app.post('/api/admin/dashboard-links', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { name, icon, url, display_order, is_active } = req.body;
      // Validation
      if (!name) return res.status(400).json({ error: 'Name is required' });
      if (!url) return res.status(400).json({ error: 'URL is required' });

      const config = loadAdminConfig();
      const newLink = {
        id: crypto.randomUUID(),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: icon || 'Link',
        url,
        display_order: typeof display_order === 'number' ? display_order : 0,
        is_active: is_active !== undefined ? is_active : true
      };

      // Ensure slug uniqueness
      let slug = newLink.slug;
      let counter = 1;
      if (!config.dashboard_links) config.dashboard_links = [];
      
      while (config.dashboard_links.some((l: any) => l.slug === slug)) {
        slug = `${newLink.slug}-${counter}`;
        counter++;
      }
      newLink.slug = slug;

      config.dashboard_links.push(newLink);
      saveAdminConfig(config);
      res.status(201).json(newLink);
    } catch (error) {
      console.error('Error creating dashboard link:', error);
      res.status(500).json({ error: 'Failed to create dashboard link' });
    }
  });

  app.put('/api/admin/dashboard-links/:id', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { name, icon, url, display_order, is_active } = req.body;
      const config = loadAdminConfig();
      if (!config.dashboard_links) config.dashboard_links = [];
      
      const index = config.dashboard_links.findIndex((l: any) => l.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Dashboard link not found' });
      }

      const link = config.dashboard_links[index];
      if (name) {
          link.name = name;
          // Re-generate slug if name changes
          let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           if (slug !== link.slug.replace(/-\d+$/, '')) { 
               let counter = 1;
               let newSlug = slug;
               while (config.dashboard_links.some((l: any) => l.slug === newSlug && l.id !== id)) {
                   newSlug = `${slug}-${counter}`;
                   counter++;
               }
               link.slug = newSlug;
           }
      }
      if (icon) link.icon = icon;
      if (url) link.url = url;
      if (display_order !== undefined) link.display_order = display_order;
      if (is_active !== undefined) link.is_active = is_active;

      config.dashboard_links[index] = link;
      saveAdminConfig(config);
      res.json(link);
    } catch (error) {
      console.error('Error updating dashboard link:', error);
      res.status(500).json({ error: 'Failed to update dashboard link' });
    }
  });

  app.delete('/api/admin/dashboard-links/:id', authMiddleware, requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const config = loadAdminConfig();
      if (!config.dashboard_links) config.dashboard_links = [];
      
      const initialLength = config.dashboard_links.length;
      config.dashboard_links = config.dashboard_links.filter((l: any) => l.id !== id);

      if (config.dashboard_links.length === initialLength) {
        return res.status(404).json({ error: 'Dashboard link not found' });
      }

      saveAdminConfig(config);
      res.json({ message: 'Dashboard link deleted' });
    } catch (error) {
      console.error('Error deleting dashboard link:', error);
      res.status(500).json({ error: 'Failed to delete dashboard link' });
    }
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

