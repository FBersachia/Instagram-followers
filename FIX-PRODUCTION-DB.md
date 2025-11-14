# Fix Production Database - Missing Users Table

## Problem
The production deployment is returning **400 errors** because the `users` table doesn't exist in the Supabase database. All API endpoints require authentication, but there are no users to authenticate.

## Solution
Run the migration to create the users table and insert the default user.

## Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `tgxcgwzdtjnwmcedzhgv`
   - Click on "SQL Editor" in the left sidebar

2. **Run the Migration**
   - Click "New Query"
   - Copy and paste the contents of `migrations/supabase_schema.sql`
   - Click "Run" or press Ctrl+Enter
   - Wait for confirmation message

3. **Verify the User Was Created**
   - Go to "Table Editor" in the left sidebar
   - Select the `users` table
   - You should see the default user: `fbersachia`

### Option 2: Using psql Command Line

```bash
# Connect to Supabase PostgreSQL
psql "postgres://postgres.tgxcgwzdtjnwmcedzhgv:bwzohKnh6ZLYpxvP@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Run the migration
\i migrations/supabase_schema.sql

# Verify
SELECT * FROM users;

# Exit
\q
```

### Option 3: Run SQL Commands Directly

Copy and paste these commands in Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert default user
INSERT INTO users (username, password_hash)
VALUES ('fbersachia', '$2b$10$40bRmpMv1Z.E1TOQZLqKdeiGyaIUlajXSMq4Pw9.VMHXQ6CQNPiAS')
ON CONFLICT (username) DO NOTHING;

-- Verify
SELECT id, username, created_at, is_active FROM users;
```

## Default Credentials

After running the migration, you can log in with:

- **Username**: `fbersachia`
- **Password**: `mce775Followers`

## Testing After Fix

1. **Clear browser cache and reload**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

2. **Login to the application**
   - Go to: https://followers.fbersachia.com.ar
   - Use the default credentials above
   - You should be redirected to the dashboard

3. **Test API endpoints**
   - Upload a JSON file
   - View non-followers
   - Add to whitelist
   - All endpoints should now work

## Troubleshooting

### Still Getting 400 Errors?
- Check if the users table exists: `\dt users` in psql
- Verify the user was created: `SELECT * FROM users;`
- Check Vercel logs for any database connection errors
- Ensure `DATABASE_URL` environment variable is set in Vercel

### Can't Login?
- Verify username is exactly: `fbersachia` (lowercase)
- Verify password is exactly: `mce775Followers` (case-sensitive)
- Check browser console for error messages
- Clear localStorage: `localStorage.clear()` in browser console

### Database Connection Errors?
- Verify Supabase database is active
- Check if connection pooling is enabled
- Ensure SSL is configured correctly
- Restart Vercel deployment

## Prevention

To prevent this in the future:

1. **Always run migrations on production** after running locally
2. **Check Supabase schema** matches local schema
3. **Document all schema changes** in migration files
4. **Test authentication** before deploying frontend changes

## Notes

- The password hash is pre-generated using bcrypt (10 rounds)
- You can create additional users through the API after logging in
- Consider changing the default password after first login
- The users table is now included in the Docker local schema
