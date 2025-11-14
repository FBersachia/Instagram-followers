const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://seguidores_user:seguidores_local_password@localhost:5432/seguidores_dev',
  ssl: false,
  max: 10,
});

async function test() {
  try {
    console.log('Testing database connection...');

    const result = await pool.query('SELECT id, username, password_hash, is_active FROM users WHERE username = $1', ['fbersachia']);

    console.log('Query successful!');
    console.log('User found:', result.rows[0]);

    await pool.end();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

test();
