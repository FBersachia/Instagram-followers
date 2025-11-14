# Local Database Setup Guide

## Overview
This guide explains how to set up and use the local PostgreSQL database for development.

## Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Start the Local Database

```bash
# Start PostgreSQL container (use one of these commands)
docker compose up -d        # Docker Desktop (newer versions)
# OR
docker-compose up -d        # Older Docker installations

# Check if the database is running
docker compose ps

# View logs
docker compose logs -f postgres
```

The database will automatically:
- Create the `seguidores_dev` database
- Run the schema setup (`database/schema.sql`)
- Apply migrations (`migrations/add_follower_counts.sql`)

### 2. Use Local Database for Development

The local database is now configured in `.env.local`. To use it:

```bash
# Copy .env.local to .env
cp .env.local .env

# Or on Windows
copy .env.local .env
```

### 3. Start the Application

```bash
# Terminal 1 - Start the API server
npm run dev:api

# Terminal 2 - Start the frontend
cd frontend
npm run dev
```

## Database Configuration

### Local Development
- **Host**: localhost
- **Port**: 5432
- **Database**: seguidores_dev
- **User**: seguidores_user
- **Password**: seguidores_local_password
- **Connection String**: `postgres://seguidores_user:seguidores_local_password@localhost:5432/seguidores_dev`

### Production (Supabase)
- Uses `.env.production` configuration
- Deployed on Vercel with environment variables

## Managing the Local Database

### Stop the Database
```bash
docker-compose stop
```

### Restart the Database
```bash
docker-compose restart
```

### Stop and Remove Container (keeps data)
```bash
docker-compose down
```

### Stop and Remove Container + Data (fresh start)
```bash
docker-compose down -v
```

### View Database Logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker-compose exec postgres psql -U seguidores_user -d seguidores_dev
```

Example queries:
```sql
-- View all tables
\dt

-- Count records in each table
SELECT COUNT(*) FROM whitelist;
SELECT COUNT(*) FROM non_followers;
SELECT COUNT(*) FROM ex_followers;
SELECT COUNT(*) FROM follower_counts;

-- View table structure
\d whitelist

-- Exit psql
\q
```

## Resetting the Database

If you need to start fresh:

```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

This will recreate the database with the schema and migrations.

## Environment Files

- **`.env.local`**: Local development configuration (Docker PostgreSQL)
- **`.env.production`**: Production configuration (Supabase)
- **`.env`**: Active configuration (copy from .env.local or .env.production)

## Troubleshooting

### Port 5432 already in use
If you have another PostgreSQL instance running:
```bash
# On Windows, check what's using port 5432
netstat -ano | findstr :5432

# Stop the process or change the port in docker-compose.yml
```

### Container won't start
```bash
# Check Docker Desktop is running
docker --version

# Check logs for errors
docker-compose logs postgres
```

### Database schema not applied
```bash
# Recreate the container
docker-compose down -v
docker-compose up -d
```

### Can't connect from application
- Ensure Docker container is running: `docker-compose ps`
- Check `.env` has the correct `DATABASE_URL`
- Verify connection string: `postgres://seguidores_user:seguidores_local_password@localhost:5432/seguidores_dev`

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. This means:
- ✅ Data persists between container restarts
- ✅ Data survives `docker-compose down`
- ❌ Data is removed with `docker-compose down -v`

## Switching Between Local and Production

### Use Local Database (Development)
```bash
cp .env.local .env
npm run dev:api
```

### Use Production Database (Testing Production)
```bash
cp .env.production .env
npm run dev:api
```

⚠️ **Warning**: Be careful when using production database locally!

## Best Practices

1. **Always use local database for development**
   - Prevents accidental changes to production data
   - Faster development cycle
   - Can reset/test freely

2. **Keep .env.production for production only**
   - Only use on Vercel deployment
   - Never commit with real credentials

3. **Backup production data regularly**
   - Supabase provides automatic backups
   - Consider manual exports for critical data

4. **Use separate databases for:**
   - Local development (Docker PostgreSQL)
   - Production (Supabase)
   - CI/CD testing (optional)

## Next Steps

After setting up the local database:
1. Start the Docker container: `docker-compose up -d`
2. Copy local config: `cp .env.local .env`
3. Start the API: `npm run dev:api`
4. Start the frontend: `cd frontend && npm run dev`
5. Upload a JSON file and start testing!
