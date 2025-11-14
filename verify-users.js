require('dotenv').config();
const { Pool } = require('pg');

async function verifyUsers() {
  const isLocalDatabase = process.env.DATABASE_URL?.includes('localhost') ||
                          process.env.DATABASE_URL?.includes('127.0.0.1');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalDatabase ? false : {
      rejectUnauthorized: false
    },
  });

  try {
    console.log('📋 Fetching all users from production database...\n');

    const result = await pool.query(
      `SELECT id, username, created_at, last_login, is_active
       FROM users
       ORDER BY id`
    );

    console.log(`Total users: ${result.rows.length}\n`);
    console.log('Users:');
    console.log('━'.repeat(80));

    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Last Login: ${user.last_login || 'Never'}`);
      console.log(`   Active: ${user.is_active ? '✅ Yes' : '❌ No'}`);
      console.log('━'.repeat(80));
    });

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

verifyUsers();
