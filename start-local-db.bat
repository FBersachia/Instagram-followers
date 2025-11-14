@echo off
echo ====================================
echo Starting Local PostgreSQL Database
echo ====================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Start the database
echo Starting PostgreSQL container...
docker compose up -d

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to start database container
    echo Try running: docker compose logs postgres
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo [SUCCESS] Database is starting!
echo ====================================
echo.
echo Database will be available at:
echo   Host: localhost
echo   Port: 5432
echo   Database: seguidores_dev
echo   User: seguidores_user
echo.
echo To check status: docker compose ps
echo To view logs: docker compose logs -f postgres
echo.
echo Waiting for database to be ready...
timeout /t 5 /nobreak >nul

REM Check if database is healthy
docker compose ps | findstr "healthy" >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Database is ready!
) else (
    echo [INFO] Database is starting... (this may take a few seconds)
    echo Run 'docker compose logs -f postgres' to monitor
)

echo.
echo You can now start the application:
echo   Terminal 1: npm run dev:api
echo   Terminal 2: cd frontend ^&^& npm run dev
echo.
pause
