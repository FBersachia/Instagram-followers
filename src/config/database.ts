import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Serverless-optimized settings
  max: process.env.NODE_ENV === 'production' ? 1 : 10, // Single connection for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true, // Allow pool to close when idle (important for serverless)
});

// Test connection on startup
pgPool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

pgPool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // Don't exit process in serverless environment
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

// Helper function to convert MySQL placeholders (?) to PostgreSQL ($1, $2, etc.)
function convertPlaceholders(sql: string): string {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

// Helper function to convert MySQL INSERT IGNORE to PostgreSQL ON CONFLICT
function convertInsertIgnore(sql: string): string {
  // Convert INSERT IGNORE to INSERT ... ON CONFLICT DO NOTHING
  return sql.replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT INTO').replace(/VALUES\s*\((.*?)\)/gi, (match) => {
    // Add ON CONFLICT at the end if it's INSERT IGNORE
    if (sql.match(/INSERT\s+IGNORE/gi)) {
      return match + ' ON CONFLICT (username) DO NOTHING';
    }
    return match;
  });
}

// MySQL-compatible result interface
interface MySQLResult {
  affectedRows: number;
  insertId?: number;
}

// MySQL-compatible execute function
async function execute<T = any>(
  sql: string,
  params: any[] = []
): Promise<[T, any]> {
  try {
    // Convert MySQL syntax to PostgreSQL
    let pgSql = convertPlaceholders(sql);
    pgSql = convertInsertIgnore(pgSql);

    const result: QueryResult = await pgPool.query(pgSql, params);

    // Return MySQL-compatible format: [rows, fields]
    // For SELECT queries, return rows
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return [result.rows as T, null];
    }

    // For INSERT/UPDATE/DELETE, return result metadata
    const mysqlResult: MySQLResult = {
      affectedRows: result.rowCount || 0,
    };

    return [mysqlResult as T, null];
  } catch (error: any) {
    // Convert PostgreSQL error codes to MySQL-like codes
    if (error.code === '23505') {
      // Unique violation -> duplicate entry
      const mysqlError: any = new Error(error.message);
      mysqlError.code = 'ER_DUP_ENTRY';
      throw mysqlError;
    }
    throw error;
  }
}

// MySQL-compatible query function (for dynamic queries)
async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<[T, any]> {
  return execute<T>(sql, params);
}

// MySQL-compatible getConnection for transactions
async function getConnection() {
  const client: PoolClient = await pgPool.connect();

  return {
    execute: async <T = any>(sql: string, params: any[] = []): Promise<[T, any]> => {
      let pgSql = convertPlaceholders(sql);
      pgSql = convertInsertIgnore(pgSql);

      const result: QueryResult = await client.query(pgSql, params);

      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return [result.rows as T, null];
      }

      const mysqlResult: MySQLResult = {
        affectedRows: result.rowCount || 0,
      };

      return [mysqlResult as T, null];
    },

    query: async <T = any>(sql: string, params: any[] = []): Promise<[T, any]> => {
      let pgSql = convertPlaceholders(sql);
      pgSql = convertInsertIgnore(pgSql);

      const result: QueryResult = await client.query(pgSql, params);
      return [result.rows as T, null];
    },

    beginTransaction: async () => {
      await client.query('BEGIN');
    },

    commit: async () => {
      await client.query('COMMIT');
    },

    rollback: async () => {
      await client.query('ROLLBACK');
    },

    release: () => {
      client.release();
    },
  };
}

const pool = {
  execute,
  query,
  getConnection,
  end: () => pgPool.end(),
};

export default pool;
