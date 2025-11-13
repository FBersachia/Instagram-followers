const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://postgres.tgxcgwzdtjnwmcedzhgv:bwzohKnh6ZLYpxvP@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

async function runMigration() {
  const client = new Client({
    host: 'db.tgxcgwzdtjnwmcedzhgv.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'bwzohKnh6ZLYpxvP',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('✓ Connected successfully!');

    const sqlFile = path.join(__dirname, '..', 'migrations', 'supabase_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('\nExecuting migration...');
    await client.query(sql);
    console.log('✓ Migration completed successfully!');

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('\n📊 Tables created:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Verify user was inserted
    const userResult = await client.query('SELECT username FROM users;');
    console.log('\n👤 Users in database:');
    userResult.rows.forEach(row => {
      console.log(`  - ${row.username}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✓ Database connection closed');
  }
}

runMigration();
