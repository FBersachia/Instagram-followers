require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function testLogin(username, password) {
  const isLocalDatabase = process.env.DATABASE_URL?.includes('localhost') ||
                          process.env.DATABASE_URL?.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalDatabase ? false : {
      rejectUnauthorized: false
    },
  });

  try {
    console.log(`🔐 Testing login for user: ${username}`);
    console.log('━'.repeat(60));

    // Get user from database
    const result = await pool.query(
      'SELECT id, username, password_hash, is_active, created_at FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
      await pool.end();
      return false;
    }

    const user = result.rows[0];
    console.log('\n✅ User found in database:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Active: ${user.is_active}`);
    console.log(`   - Created: ${user.created_at}`);
    console.log(`   - Password hash: ${user.password_hash.substring(0, 29)}...`);

    // Verify password
    console.log('\n🔍 Verifying password...');
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      console.log('✅ Password is CORRECT! Authentication would succeed.');
    } else {
      console.log('❌ Password is INCORRECT! Authentication would fail.');
    }

    console.log('━'.repeat(60));
    await pool.end();
    return passwordMatch;
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await pool.end();
    return false;
  }
}

// Test with the credentials
const username = process.argv[2] || 'emab';
const password = process.argv[3] || 'F5l$2o25';

testLogin(username, password);
