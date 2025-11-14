#!/bin/bash
# Configure PostgreSQL to use md5 password auth for all connections
# This runs after database initialization

set -e

# Wait for PostgreSQL to be ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 1
done

# Update pg_hba.conf to use md5 for all host connections
echo "Configuring pg_hba.conf for development..."

# Backup original
cp /var/lib/postgresql/data/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf.bak

# Replace the last line (scram-sha-256) with md5
sed -i 's/host all all all scram-sha-256/host all all all md5/' /var/lib/postgresql/data/pg_hba.conf

# Reload PostgreSQL configuration
pg_ctl reload -D /var/lib/postgresql/data

echo "pg_hba.conf configured successfully!"
