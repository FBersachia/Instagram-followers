-- PostgreSQL Schema for Seguidores Application
-- This file is automatically executed when the Docker container starts

-- Whitelist table: users excluded from analysis (e.g., celebrities)
CREATE TABLE IF NOT EXISTS whitelist (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Non-followers table: users who don't follow back
CREATE TABLE IF NOT EXISTS non_followers (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ex-followers table: users who used to follow but stopped
CREATE TABLE IF NOT EXISTS ex_followers (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  unfollowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for application authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Follower counts table: track follower count over time
CREATE TABLE IF NOT EXISTS follower_counts (
  id SERIAL PRIMARY KEY,
  count INTEGER NOT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whitelist_username ON whitelist(username);
CREATE INDEX IF NOT EXISTS idx_non_followers_username ON non_followers(username);
CREATE INDEX IF NOT EXISTS idx_ex_followers_username ON ex_followers(username);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_follower_counts_recorded_at ON follower_counts(recorded_at);

-- Insert default user: fbersachia / mce775Followers
-- Password hash generated with bcrypt (10 rounds): mce775Followers
INSERT INTO users (username, password_hash)
VALUES ('fbersachia', '$2b$10$40bRmpMv1Z.E1TOQZLqKdeiGyaIUlajXSMq4Pw9.VMHXQ6CQNPiAS')
ON CONFLICT (username) DO NOTHING;
