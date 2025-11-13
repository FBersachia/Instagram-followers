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

**Last Updated**: 2025-01-13
**Total Errors Documented**: 1
