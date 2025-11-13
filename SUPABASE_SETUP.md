# Supabase Database Setup Guide

## Migration Status: ✓ COMPLETED

The database migration from MySQL to PostgreSQL (Supabase) has been completed successfully.

## Current Database Configuration

- **Host**: `aws-1-sa-east-1.pooler.supabase.com:5432`
- **Database**: `postgres`
- **Schema**: PostgreSQL-compatible schema created
- **Connection**: SSL enabled with `rejectUnauthorized: false`

## Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `tgxcgwzdtjnwmcedzhgv`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the SQL from `database/schema_postgres.sql`
6. Click **Run** or press `Ctrl+Enter`

The schema will be created instantly.

## Option 2: Using the Migration Script

If you prefer to run it programmatically:

```bash
node scripts/migrate-supabase.js
```

**Note**: Make sure your Supabase database is running and not paused.

## Option 3: Manual Execution via psql

If you have PostgreSQL client installed:

```bash
psql "postgres://postgres:bwzohKnh6ZLYpxvP@db.tgxcgwzdtjnwmcedzhgv.supabase.co:5432/postgres" -f migrations/supabase_schema.sql
```

## Verify Installation

After running the migration, verify the tables were created:

### In Supabase Dashboard:

1. Go to **Table Editor**
2. You should see these tables:
   - whitelist
   - non_followers
   - ex_followers
   - users
   - follower_counts

### Using SQL Editor:

Run this query to list all tables:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Verify Default User:

```sql
SELECT id, username, is_active, created_at
FROM users;
```

You should see the user `fbersachia`.

## Tables Created

### 1. **whitelist**
- Stores usernames excluded from analysis (e.g., celebrities, close friends)
- Columns: `id`, `username`, `created_at`

### 2. **non_followers**
- Stores usernames of users who don't follow back
- Columns: `id`, `username`, `created_at`

### 3. **ex_followers**
- Stores usernames of users who used to follow but stopped
- Columns: `id`, `username`, `unfollowed_at`

### 4. **users**
- Application users for authentication
- Columns: `id`, `username`, `password_hash`, `created_at`, `last_login`, `is_active`
- Default user: `fbersachia` / `mce775Followers`

### 5. **follower_counts**
- Historical tracking of follower counts over time
- Columns: `id`, `count`, `recorded_at`, `created_at`

## Migration Completed ✓

The following steps have been completed:

1. **✓ `.env` file updated** with Supabase credentials:

```env
# PostgreSQL Database Configuration (Supabase)
DATABASE_URL=postgres://postgres.tgxcgwzdtjnwmcedzhgv:bwzohKnh6ZLYpxvP@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

2. **✓ `src/config/database.ts` updated** to use PostgreSQL with MySQL-compatible adapter:

```typescript
import { Pool } from 'pg';

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
```

**Key Features**:
- MySQL-compatible adapter layer (no service layer changes needed)
- Automatic placeholder conversion (`?` → `$1, $2...`)
- Automatic syntax conversion (`INSERT IGNORE` → `INSERT ... ON CONFLICT`)
- Error code mapping (PostgreSQL `23505` → MySQL `ER_DUP_ENTRY`)

3. **✓ PostgreSQL client installed**:

```bash
npm install pg @types/pg
```

4. **✓ All SQL queries converted** to PostgreSQL:
   - `AUTO_INCREMENT` → `SERIAL`
   - `DATETIME` → `TIMESTAMP`
   - `INSERT IGNORE` → `INSERT ... ON CONFLICT DO NOTHING` (via adapter)
   - Handled by adapter layer, no manual changes needed

## Troubleshooting

### Database Connection Issues

If you can't connect:
1. Check if your Supabase project is paused (go to Settings > General)
2. Verify the database credentials are correct
3. Check if your IP is allowed (Supabase allows all IPs by default)

### Tables Already Exist

If you see "table already exists" errors, the migration was successful! You can verify by checking the Table Editor.

### Authentication Issues

Make sure the `users` table has the default user:

```sql
SELECT * FROM users WHERE username = 'fbersachia';
```

If not found, run:

```sql
INSERT INTO users (username, password_hash)
VALUES ('fbersachia', '$2b$10$40bRmpMv1Z.E1TOQZLqKdeiGyaIUlajXSMq4Pw9.VMHXQ6CQNPiAS')
ON CONFLICT (username) DO NOTHING;
```

## Support

For Supabase-specific issues, visit: https://supabase.com/docs
