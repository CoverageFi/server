import { Database } from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { registerUserDAO } from '../dao';
import { SqliteUserDAO } from './sqliteUserDAO';
import { logger } from '../../logging/logger';

const dbPath = './data/mydatabase.sqlite';
const directory = path.dirname(dbPath);

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Use the DATABASE_FILENAME environment variable or default to './data/mydatabase.sqlite'
const client = new Database(
  process.env.DATABASE_FILENAME ?? './data/mydatabase.sqlite'
);
const userDAO = new SqliteUserDAO(client);

export const createUserTable = (db: Database) => {
  db.serialize(() => {
    db.exec(
      'CREATE TABLE IF NOT EXISTS users (userId TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP)'
    );
  });
};

export const initDB = () => {
  registerUserDAO(userDAO);
  createUserTable(client);
  logger.info('Created users table');
};

export const cleanupDB = () => {
  client.close((err) => {
    if (err) {
      return logger.error(err.message);
    }
    logger.info('Database connection closed successfully');
  });
};
