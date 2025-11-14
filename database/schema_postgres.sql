-- PostgreSQL Schema for Seguidores App
-- Compatible with Supabase

-- Users table for application authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Whitelist table: users excluded from analysis (e.g., celebrities)
CREATE TABLE IF NOT EXISTS whitelist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, username)
);

-- Non-followers table: users who don't follow back
CREATE TABLE IF NOT EXISTS non_followers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, username)
);

-- Ex-followers table: users who used to follow but stopped
CREATE TABLE IF NOT EXISTS ex_followers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  unfollowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, username)
);

-- Follower counts table: track follower count over time
CREATE TABLE IF NOT EXISTS follower_counts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  count INTEGER NOT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whitelist_user_username ON whitelist(user_id, username);
CREATE INDEX IF NOT EXISTS idx_non_followers_user_username ON non_followers(user_id, username);
CREATE INDEX IF NOT EXISTS idx_ex_followers_user_username ON ex_followers(user_id, username);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_follower_counts_user_recorded_at ON follower_counts(user_id, recorded_at);
