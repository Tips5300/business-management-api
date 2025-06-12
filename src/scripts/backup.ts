import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';

export async function backup() {
  try {
    const dbPath = process.env.DB_PATH || 'database.sqlite';
    const backupDir = 'backups';
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.sqlite`);

    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      logger.info(`Database backup created: ${backupPath}`);
    } else {
      logger.warn('Database file not found for backup');
    }
  } catch (error) {
    logger.error('Backup failed:', error);
  }
}