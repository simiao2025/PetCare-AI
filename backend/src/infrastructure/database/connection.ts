import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'petcare',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

// Also support connection string (DATABASE_URL) commonly used in Vercel
const pool = process.env.DATABASE_URL 
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false 
    })
  : new Pool(connectionConfig);

// Singleton connection
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};
