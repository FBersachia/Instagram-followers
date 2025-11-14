require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function checkUser(username, testPassword) {
  const isLocalDatabase = process.env.DATABASE_URL?.includes('localhost') ||
                          process.env.DATABASE_URL?.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalDatabase ? false : {
      rejectUnauthorized: false
    },
  });

  try {
    console.log(`\n🔍 Checking user: ${username}`);
    console.log('━'.repeat(80));

    const result = await pool.query(
      'SELECT id, username, password_hash, is_active, created_at, last_login FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
      await pool.end();
      return;
    }

    const user = result.rows[0];
    console.log('\n✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Active: ${user.is_active}`);
    console.log(`   Created: ${user.created_at}`);
    console.log(`   Last Login: ${user.last_login || 'Never'}`);
    console.log(`   Password Hash Length: ${user.password_hash.length} characters`);
    console.log(`   Password Hash: ${user.password_hash}`);

    if (testPassword) {
      console.log('\n🔐 Testing password...');
      const match = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`   Password "${testPassword}": ${match ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
    }

    console.log('━'.repeat(80));
    await pool.end();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await pool.end();
  }
}

const username = process.argv[2] || 'emab';
const testPassword = process.argv[3];

checkUser(username, testPassword);
