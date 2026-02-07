import { Pool } from 'pg';

// connectionString environment variable se uthayega
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('[DB] New client connected to the pool');
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[DB] Executed query in ${duration}ms | Rows: ${res.rowCount}`);
    return res;
  } catch (err) {
    console.error('Error in query', err);
    throw err;
  }
};

export default pool;