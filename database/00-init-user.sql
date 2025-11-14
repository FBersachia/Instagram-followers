-- This script runs before schema.sql to set up the database user
-- Note: The database and user are already created by POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB
-- This script just ensures the password is set correctly

ALTER USER seguidores_user WITH PASSWORD 'seguidores_local_password';
