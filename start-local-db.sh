#!/bin/bash

echo "===================================="
echo "Starting Local PostgreSQL Database"
echo "===================================="
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

echo "[OK] Docker is running"
echo ""

# Start the database
echo "Starting PostgreSQL container..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to start database container"
    echo "Try running: docker compose logs postgres"
    echo ""
    exit 1
fi

echo ""
echo "===================================="
echo "[SUCCESS] Database is starting!"
echo "===================================="
echo ""
echo "Database will be available at:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: seguidores_dev"
echo "  User: seguidores_user"
echo ""
echo "To check status: docker compose ps"
echo "To view logs: docker compose logs -f postgres"
echo ""
echo "Waiting for database to be ready..."
sleep 5

# Check if database is healthy
if docker compose ps | grep -q "healthy"; then
    echo "[OK] Database is ready!"
else
    echo "[INFO] Database is starting... (this may take a few seconds)"
    echo "Run 'docker compose logs -f postgres' to monitor"
fi

echo ""
echo "You can now start the application:"
echo "  Terminal 1: npm run dev:api"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
