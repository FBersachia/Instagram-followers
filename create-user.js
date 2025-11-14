require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function createUser(username, password) {
  // Detect if local or remote database
  const isLocalDatabase = process.env.DATABASE_URL?.includes('localhost') ||
                          process.env.DATABASE_URL?.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalDatabase ? false : {
      rejectUnauthorized: false
    },
  });

  try {
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('📝 Creating user in production database...');
    const result = await pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username)
       DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true
       RETURNING id, username, created_at, is_active`,
      [username, passwordHash]
    );

    console.log('\n✅ User created successfully!');
    console.log('📊 User details:');
    console.log(`   - ID: ${result.rows[0].id}`);
    console.log(`   - Username: ${result.rows[0].username}`);
    console.log(`   - Created at: ${result.rows[0].created_at}`);
    console.log(`   - Active: ${result.rows[0].is_active}`);
    console.log(`   - Password hash: ${passwordHash.substring(0, 20)}...`);

    await pool.end();
    return result.rows[0];
  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    await pool.end();
    throw error;
  }
}

// Get username and password from command line arguments
const username = process.argv[2] || 'valujua';
const password = process.argv[3] || 'Rnlgh2o25';

console.log(`Creating user: ${username}`);
createUser(username, password);
