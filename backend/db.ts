import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'backend', 'data', 'workspace.db');

// Ensure directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    description VARCHAR(500) NOT NULL,
    key_features TEXT DEFAULT '',
    base_activity VARCHAR(80),
    metrics_enabled BOOLEAN DEFAULT 0,
    metric_name VARCHAR(50),
    metric_value VARCHAR(50),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Folder',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add key_features column if it doesn't exist
try {
  const tableInfo = db.pragma('table_info(apps)') as any[];
  const hasKeyFeatures = tableInfo.some(col => col.name === 'key_features');
  if (!hasKeyFeatures) {
    db.exec(`ALTER TABLE apps ADD COLUMN key_features TEXT DEFAULT ''`);
  }
} catch (e) {
  console.error("Migration error:", e);
}

export default db;
