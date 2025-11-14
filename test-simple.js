const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://seguidores_user:test123@localhost:5432/seguidores_dev',
  ssl: false,
});

async function test() {
  try {
    console.log('Testing with simple password...');
    const result = await pool.query('SELECT 1 as test');
    console.log('SUCCESS! Result:', result.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('FAILED! Error:', error.message);
    process.exit(1);
  }
}

test();
