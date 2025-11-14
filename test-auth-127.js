const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',  // Explicit IP instead of 'localhost'
  port: 5432,
  user: 'seguidores_user',
  password: 'seguidores_local_password',
  database: 'seguidores_dev',
  ssl: false,
});

async function test() {
  try {
    console.log('Testing database connection with 127.0.0.1...');

    const result = await pool.query('SELECT id, username, password_hash, is_active FROM users WHERE username = $1', ['fbersachia']);

    console.log('Query successful!');
    console.log('User found:', result.rows[0]);

    await pool.end();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
