-- PostgreSQL Schema for Seguidores App
-- Compatible with Supabase

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
CREATE INDEX IF NOT EXISTS idx_follower_counts_recorded_at ON follower_counts(recorded_at);
