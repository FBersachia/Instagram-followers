require('dotenv').config();
const { Pool } = require('pg');

// Test production database connection
async function testProductionConnection() {
  const connectionString = process.env.DATABASE_URL;

  console.log('Testing connection to:', connectionString?.replace(/:[^:]*@/, ':****@') || 'NO URL PROVIDED');

  // Detect if local or remote database
  const isLocalDatabase = connectionString?.includes('localhost') ||
                          connectionString?.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: connectionString,
    ssl: isLocalDatabase ? false : {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');

    // Test query
    const result = await client.query('SELECT version()');
    console.log('✅ Database version:', result.rows[0].version);

    // Check tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n📋 Tables in database:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    client.release();
    await pool.end();

    console.log('\n✅ Connection test successful!');
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    await pool.end();
    return false;
  }
}

testProductionConnection();
