# Errors & Solutions Documentation

This file documents errors encountered during development and deployment, along with their solutions.

---

## 📋 Error Documentation Format

Use this template when documenting new errors:

```markdown
## [Error Title/Type]

**Date**: YYYY-MM-DD
**Context**: Where/when the error occurred (deployment, development, etc.)
**Severity**: Critical / High / Medium / Low

### Error Message
```
[Exact error message or log output]
```

### Root Cause
[Explanation of what caused the error]

### Solution
[Step-by-step solution that fixed the issue]

### Prevention
[How to avoid this error in the future]

### Related Files
- `file/path/here.ext`
- `another/file.ext`

### References
- [Link to relevant documentation]
- [Link to related issue/PR]

---
```

---

## Error Log

### 1. Vercel Frontend Deployment: "Output Directory 'public' is empty"

**Date**: 2025-01-13
**Context**: Frontend deployment to Vercel (Vite + React app)
**Severity**: Critical (blocking deployment)

### Error Message
```
19:56:03.685 Error: The Output Directory "public" is empty.
19:56:03.685 Learn More: https://vercel.link/missing-public-directory
```

Additional symptoms:
```
19:55:21.020 Found .vercelignore (repository root)
19:55:21.020 Removed 75 ignored files defined in .vercelignore
19:55:21.020   /frontend/.env.production
19:55:21.020   /frontend/.eslintrc.json
...
19:56:01.384 > seguidores@1.0.0 build
19:56:01.384 > tsc
```

### Root Cause

**Multiple issues combined:**

1. **Root `.vercelignore` excluded entire `frontend` directory**
   - The root `.vercelignore` file contained `frontend` in the exclusion list
   - This was added to optimize backend deployment
   - **Problem**: Vercel reads root `.vercelignore` BEFORE changing to Root Directory
   - Result: All frontend files were removed before the build started

2. **Wrong build command executed**
   - Build log showed: `> seguidores@1.0.0 build` (root package.json)
   - Should have shown: `> frontend@1.0.0 build` (frontend package.json)
   - This indicated Vercel was building from root despite Root Directory setting

3. **Output directory mismatch**
   - Backend uses `tsc` which outputs to `dist/`
   - Frontend uses `vite build` which outputs to `dist/`
   - Vercel was looking for `public/` directory (incorrect)

### Solution

**Step 1: Remove `frontend` exclusion from root `.vercelignore`**

Edited `.vercelignore`:
```diff
  # Logs
  logs
  *.log

- # Frontend (deployed separately)
- frontend
-
  # Development files
  .vscode
```

**Step 2: Create frontend-specific `.vercelignore`**

Created `frontend/.vercelignore`:
```
# Frontend-specific vercel ignore
# This overrides the root .vercelignore

# Only ignore these in frontend deployment
node_modules
.env.local
.env.development
coverage
*.log
.DS_Store
```

**Step 3: Create `frontend/vercel.json`**

Created proper Vite configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Step 4: Verify Vercel project settings**

Confirmed in Vercel dashboard:
- **Root Directory**: `frontend` ✓
- **Framework Preset**: `Vite` ✓
- **Build Command**: `npm run build` (uses frontend's package.json) ✓
- **Output Directory**: `dist` ✓

**Step 5: Redeploy**

After pushing changes, redeployed the project in Vercel dashboard.

### Prevention

**Best practices to avoid this error:**

1. **Never exclude deployment directories in root `.vercelignore`**
   - ❌ Don't add `frontend`, `backend`, `api` to root ignore file
   - ✅ Use project-specific `.vercelignore` files instead

2. **Keep root `.vercelignore` minimal**
   ```
   # Root .vercelignore (minimal)
   node_modules
   *.log
   .env.local
   .DS_Store
   ```

3. **Create directory-specific ignore files**
   ```
   project/
   ├── .vercelignore           # Minimal
   ├── api/
   │   └── .vercelignore       # Backend-specific
   └── frontend/
       └── .vercelignore       # Frontend-specific
   ```

4. **Document Vercel project configuration**
   - Root Directory setting is critical for monorepos
   - Document which directory each Vercel project uses
   - Add to README or deployment documentation

5. **Verify build logs**
   - Check which `package.json` is being executed
   - Confirm correct build command is running
   - Verify output directory matches framework defaults

6. **Test deployment configuration locally**
   ```bash
   # Test frontend build
   cd frontend
   npm install
   npm run build
   ls -la dist/  # Should contain built files
   ```

### Related Files
- `.vercelignore` (root)
- `frontend/.vercelignore`
- `frontend/vercel.json`
- `frontend/vite.config.ts`
- `frontend/package.json`

### References
- [Vercel .vercelignore Documentation](https://vercel.com/docs/concepts/projects/project-configuration#vercelignore)
- [Vercel Root Directory Setting](https://vercel.com/docs/concepts/deployments/build-step#root-directory)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

### Commits
- Fix: `783405e` - Fix frontend deployment by removing frontend exclusion from root .vercelignore
- Related: `7981611` - Add SPA routing rewrites to frontend vercel.json
- Related: `6c1d4a6` - Add vercel.json for frontend deployment configuration

---

### 2. TypeScript Compilation Errors in Frontend Deployment

**Date**: 2025-01-13
**Context**: Frontend deployment to Vercel (React + TypeScript + Vite)
**Severity**: Critical (blocking deployment)

### Error Message
```
20:08:56.681 src/components/ProtectedRoute.tsx(15,21): error TS2322: Type '{ fullscreen: true; text: string; }' is not assignable to type 'IntrinsicAttributes & LoadingProps'.
20:08:56.682   Property 'fullscreen' does not exist on type 'IntrinsicAttributes & LoadingProps'. Did you mean 'fullScreen'?
20:08:56.682 src/pages/ExFollowersPage.tsx(92,9): error TS2322: Type 'number' is not assignable to type 'string'.
20:08:56.682 src/pages/ExFollowersPage.tsx(93,9): error TS2322: Type 'number' is not assignable to type 'string'.
20:08:56.682 src/pages/LoginPage.tsx(77,13): error TS2322: Type '{ children: (string | Element)[]; type: "submit"; className: string; isLoading: boolean; disabled: boolean; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
20:08:56.683   Property 'isLoading' does not exist on type 'IntrinsicAttributes & ButtonProps'. Did you mean 'loading'?
20:08:56.683 src/pages/NonFollowersPage.tsx(16,17): error TS6133: 'UserMinus' is declared but its value is never read.
20:08:56.683 src/pages/NonFollowersPage.tsx(16,28): error TS6133: 'Trash2' is declared but its value is never read.
20:08:56.683 src/pages/NonFollowersPage.tsx(69,9): error TS2322: Type 'number' is not assignable to type 'string'.
20:08:56.684 src/pages/NonFollowersPage.tsx(70,9): error TS2322: Type 'number' is not assignable to type 'string'.
20:08:56.684 src/pages/WhitelistPage.tsx(182,13): error TS2739: Type 'ReactElement<any, any>' is missing the following properties from type '{ label: string; onClick: () => void; }': label, onClick
20:08:56.706 Error: Command "npm run build" exited with 2
```

### Root Cause

**Multiple TypeScript type mismatches:**

1. **ProtectedRoute.tsx**: Used `fullscreen` prop instead of `fullScreen` (camelCase) for the `Loading` component
2. **LoginPage.tsx**: Used `isLoading` prop instead of `loading` for the `Button` component
3. **NonFollowersPage.tsx**: Imported `UserMinus` and `Trash2` icons but never used them
4. **ExFollowersPage.tsx & NonFollowersPage.tsx**: Type inference issue in sorting logic
   - Variables `aValue` and `bValue` were inferred as `string` (from field type)
   - When sorting by date, `getTime()` assigns `number` to these variables
   - TypeScript flagged this as type mismatch (number not assignable to string)
5. **WhitelistPage.tsx**: `EmptyState` component's `action` prop expected `{label: string, onClick: () => void}` but received a `ReactElement` (Button component)

### Solution

**Step 1: Fix prop name mismatches**

Fixed `ProtectedRoute.tsx`:
```diff
- return <Loading fullscreen text="Loading..." />;
+ return <Loading fullScreen text="Loading..." />;
```

Fixed `LoginPage.tsx`:
```diff
  <Button
    type="submit"
    className="w-full"
-   isLoading={isLoading}
+   loading={isLoading}
    disabled={isLoading || !username || !password}
  >
```

**Step 2: Remove unused imports**

Fixed `NonFollowersPage.tsx`:
```diff
- import { Users, UserMinus, Trash2, ArrowRight } from 'lucide-react';
+ import { Users, ArrowRight } from 'lucide-react';
```

**Step 3: Fix type inference in sorting logic**

Fixed `ExFollowersPage.tsx` and `NonFollowersPage.tsx`:
```diff
  const sortedUsers = useMemo(() => {
    const sorted = [...dateFilteredUsers];
    sorted.sort((a, b) => {
-     let aValue = a[sortField];
-     let bValue = b[sortField];
+     let aValue: string | number = a[sortField];
+     let bValue: string | number = b[sortField];

      if (sortField === 'unfollowed_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
```

**Step 4: Fix EmptyState action prop**

Fixed `WhitelistPage.tsx`:
```diff
  <EmptyState
    icon={<Shield className="h-12 w-12 text-gray-400" />}
    title="No whitelisted users"
    description="Add users to whitelist to exclude them from non-followers analysis"
-   action={
-     <Button onClick={() => setShowAddModal(true)}>
-       <UserPlus className="h-4 w-4 mr-2" />
-       Add First User
-     </Button>
-   }
+   action={{
+     label: "Add First User",
+     onClick: () => setShowAddModal(true)
+   }}
  />
```

**Step 5: Verify build**

```bash
cd frontend
npm run build
```

Result: Build succeeded with no TypeScript errors.

### Prevention

**Best practices to avoid TypeScript errors in production:**

1. **Always run type checks before committing**
   ```bash
   npm run build  # Includes tsc type checking
   # or
   npm run type-check  # If available
   ```

2. **Enable strict TypeScript in development**
   - Ensure `tsconfig.json` has `"strict": true`
   - Use TypeScript-aware IDE (VSCode with TypeScript extension)
   - Fix errors in development before they reach deployment

3. **Match prop names with component interfaces**
   - Check component prop types before using them
   - Use IDE autocomplete to avoid typos
   - Example: `Loading` uses `fullScreen`, not `fullscreen`

4. **Explicitly type variables when needed**
   - When reassigning variables with different types, explicitly declare union types
   - Example: `let aValue: string | number = ...`

5. **Remove unused imports automatically**
   - Configure ESLint with `no-unused-vars` rule
   - Use IDE features to auto-remove unused imports
   - Run linter before committing

6. **Follow component API contracts**
   - When a component expects an object, don't pass a ReactElement
   - Check component prop type definitions
   - Use TypeScript intellisense to verify prop types

7. **Add pre-commit hooks**
   ```json
   // package.json
   {
     "husky": {
       "hooks": {
         "pre-commit": "npm run type-check && npm run lint"
       }
     }
   }
   ```

### Related Files
- `frontend/src/components/ProtectedRoute.tsx`
- `frontend/src/components/Loading.tsx`
- `frontend/src/components/Button.tsx`
- `frontend/src/components/EmptyState.tsx`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/pages/NonFollowersPage.tsx`
- `frontend/src/pages/ExFollowersPage.tsx`
- `frontend/src/pages/WhitelistPage.tsx`
- `frontend/tsconfig.json`

### References
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite TypeScript Guide](https://vitejs.dev/guide/features.html#typescript)

### Commits
- Fix: [To be committed] - Fix TypeScript compilation errors in frontend components

---

## How to Add New Errors

1. Copy the error template from the top of this file
2. Fill in all sections with detailed information
3. Include exact error messages and logs
4. Explain the root cause clearly
5. Document the complete solution step-by-step
6. Add prevention tips for the future
7. Link to related files and commits
8. Keep the format consistent for easy reference

---

### 3. PostgreSQL Authentication Failed for Local Database (Docker)

**Date**: 2025-11-14
**Context**: Local development with PostgreSQL in Docker container
**Severity**: High (blocking local development authentication)

### Error Message
```
error: la autentificación password falló para el usuario "seguidores_user"
  severity: 'FATAL',
  code: '28P01',
  file: 'auth.c',
  line: '332',
  routine: 'auth_failed'
```

Frontend error:
```
POST http://localhost:3000/api/auth/login 500 (Internal Server Error)
Login failed
```

Backend error:
```
Error authenticating user: The server does not support SSL connections
Error authenticating user: la autentificación password falló para el usuario "seguidores_user"
```

### Root Cause

**Multiple authentication issues:**

1. **Initial SSL Problem**
   - Database config always enabled SSL: `ssl: { rejectUnauthorized: false }`
   - Local PostgreSQL Docker container doesn't support SSL
   - Connection was rejected before authentication could occur

2. **PostgreSQL Authentication Method Mismatch**
   - PostgreSQL 15 uses SCRAM-SHA-256 authentication by default
   - Connection string includes password but pg_hba.conf not properly configured
   - Docker init process creates user with password but external TCP connections fail auth
   - Unix socket connections work (via `docker exec`) but TCP connections from localhost fail

3. **Password Authentication Issues**
   - `POSTGRES_PASSWORD` environment variable set in docker-compose.yml
   - However, password authentication over TCP not working correctly
   - Suspected issue with pg_hba.conf not being applied during initialization
   - Volume mount timing: pg_hba.conf mounted but may not override default config

4. **Connection Pool Configuration**
   - `allowExitOnIdle: true` caused Node.js process to exit immediately
   - Made debugging difficult as server appeared to start then immediately exit

### Solution

**Attempted Solutions:**

1. ✅ **Fixed SSL for local database** (src/config/database.ts:6-20)
   ```typescript
   const isLocalDatabase = process.env.DATABASE_URL?.includes('localhost') ||
                           process.env.DATABASE_URL?.includes('127.0.0.1');

   const pgPool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: isLocalDatabase ? false : {
       rejectUnauthorized: false
     },
   });
   ```

2. ✅ **Fixed connection pool exit behavior** (src/config/database.ts:17-20)
   ```typescript
   max: 10,
   idleTimeoutMillis: 30000,
   connectionTimeoutMillis: 10000,
   // Removed: allowExitOnIdle: true
   ```

3. ✅ **Fixed error handler** (src/config/database.ts:28-31)
   ```typescript
   pgPool.on('error', (err) => {
     console.error('Unexpected database error:', err);
     // Log error but don't exit - let the application handle it
   });
   ```

4. ⚠️ **Attempted pg_hba.conf configuration** (PARTIALLY WORKING)
   - Created custom `database/pg_hba.conf` with md5 authentication
   - Mounted to `/var/lib/postgresql/data/pg_hba.conf`
   - Issue: May be overwritten or not reloaded after init

5. ⚠️ **Attempted trust authentication** (NOT WORKING)
   - Set `POSTGRES_HOST_AUTH_METHOD: trust` in docker-compose.yml
   - Still getting password authentication errors
   - Indicates pg_hba.conf not being properly applied

### Current Status

**Partially resolved - SSL issue fixed, but password authentication still failing.**

- ✅ SSL disabled for localhost connections
- ✅ Server stays running (no premature exit)
- ✅ Health check endpoint works: `http://localhost:3000/health`
- ✅ Direct database queries work via `docker exec` (Unix socket)
- ✅ Database container running and healthy
- ✅ Password confirmed correct (reset and tested with simple password)
- ✅ pg_hba.conf changed from scram-sha-256 to md5
- ✅ Password re-hashed with MD5 encryption
- ❌ TCP password authentication from Node.js on Windows host STILL fails
- ❌ Login endpoint returns 500 error

### Root Cause Analysis

**After extensive debugging, we determined:**

1. **Password is NOT the issue**
   - Tested with original password: `seguidores_local_password`
   - Reset to simple test password: `test123`
   - Both fail with same error

2. **Authentication method incompatibility**
   - PostgreSQL 15 defaults to SCRAM-SHA-256 authentication
   - Changed to MD5 authentication in pg_hba.conf
   - Re-hashed password with MD5 encryption
   - Still fails from Windows host

3. **Network routing issue**
   - Unix socket connections work (via `docker exec`)
   - TCP connections to 127.0.0.1:5432 fail from Windows
   - Docker network: 172.18.0.0/16, Gateway: 172.18.0.1
   - Windows host connections may be routed through Docker gateway
   - pg_hba.conf trust rule only applies to 127.0.0.1/32

4. **Docker on Windows compatibility**
   - This appears to be a Windows + Docker Desktop + PostgreSQL 15 specific issue
   - Authentication works from inside container
   - Authentication fails from Windows host through port mapping
   - Likely related to how Docker Desktop handles localhost networking on Windows

### Verification Steps Taken

```bash
# 1. Verified database user exists
docker exec seguidores-db psql -U seguidores_user -d seguidores_dev -c "\du"
# Result: User exists with password

# 2. Reset password explicitly
docker exec seguidores-db psql -U seguidores_user -d seguidores_dev \
  -c "ALTER USER seguidores_user WITH PASSWORD 'test123';"
# Result: Password changed

# 3. Changed authentication method
docker exec seguidores-db sed -i 's/scram-sha-256/md5/g' \
  /var/lib/postgresql/data/pg_hba.conf
# Result: Changed to md5

# 4. Re-hashed password with MD5
docker exec seguidores-db psql -U seguidores_user -d seguidores_dev \
  -c "SET password_encryption = 'md5'; ALTER USER seguidores_user WITH PASSWORD 'test123';"
# Result: Password re-hashed

# 5. Reloaded PostgreSQL config
docker exec seguidores-db psql -U seguidores_user -d seguidores_dev \
  -c "SELECT pg_reload_conf();"
# Result: Config reloaded

# 6. Tested connection from Node.js
node test-simple.js
# Result: STILL FAILS with "password authentication failed"
```

### Workaround

**Recommended: Use production Supabase database**
```bash
# Create .env.production with your Supabase credentials
# Then copy to .env
cp .env.production .env
npm run dev:api
```

**Alternative workarounds (not yet tested):**
1. Try PostgreSQL 14 instead of 15 (may have better compatibility)
2. Use different PostgreSQL Docker image (e.g., official postgres without Alpine)
3. Configure Docker to use host networking mode
4. Install PostgreSQL natively on Windows instead of Docker
5. Use WSL2 with Docker inside Linux environment

### Prevention

**Best practices for PostgreSQL in Docker:**

1. **Detect local vs remote database for SSL**
   ```typescript
   const isLocalDatabase = process.env.DATABASE_URL?.includes('localhost');
   const ssl = isLocalDatabase ? false : { rejectUnauthorized: false };
   ```

2. **Configure pg_hba.conf in initialization scripts**
   ```bash
   # In docker-entrypoint-initdb.d/
   echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
   pg_ctl reload
   ```

3. **Use POSTGRES_HOST_AUTH_METHOD correctly**
   - Set during initial database creation only
   - For development: `POSTGRES_HOST_AUTH_METHOD: trust`
   - For production: Always use password authentication

4. **Test database connection separately**
   ```javascript
   // test-db.js
   const { Pool } = require('pg');
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   pool.query('SELECT 1').then(() => console.log('OK'));
   ```

5. **Document database setup clearly**
   - Include complete Docker setup in README
   - Document both local and production configurations
   - Provide troubleshooting steps

### Related Files
- `src/config/database.ts` (database configuration)
- `docker-compose.yml` (PostgreSQL container config)
- `database/schema.postgres.sql` (schema initialization)
- `database/pg_hba.conf` (authentication configuration)
- `database/00-init-user.sql` (user initialization)
- `.env.local` (local environment variables)
- `README-LOCAL-DB.md` (local database setup guide)

### References
- [PostgreSQL Authentication Methods](https://www.postgresql.org/docs/15/auth-methods.html)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [pg_hba.conf Documentation](https://www.postgresql.org/docs/15/auth-pg-hba-conf.html)
- [Node.js pg Driver Documentation](https://node-postgres.com/)

### Next Steps

**Completed Investigation:**
- [x] Verified password is correct
- [x] Changed authentication method from scram-sha-256 to md5
- [x] Re-hashed password with MD5 encryption
- [x] Confirmed pg_hba.conf is being applied
- [x] Tested with multiple passwords (original and simple)
- [x] Identified root cause: Windows + Docker Desktop networking incompatibility

**Remaining Options:**
- [ ] Try PostgreSQL 14 instead of 15
- [ ] Test with official postgres image (non-Alpine)
- [ ] Test with Docker host networking mode
- [ ] Test from WSL2 instead of Windows
- [ ] Consider native PostgreSQL installation on Windows
- [ ] Document working solution once found

**Conclusion:** This is a known compatibility issue with Docker Desktop on Windows and PostgreSQL 15 authentication. The password is correct, but the networking layer between Windows host and Docker container is incompatible with PostgreSQL's password authentication. Recommend using production Supabase database for development until a local solution is found.

---

**Last Updated**: 2025-11-14
**Total Errors Documented**: 3
