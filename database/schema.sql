-- Create database
CREATE DATABASE IF NOT EXISTS seguidores;
USE seguidores;

-- Whitelist table: users excluded from analysis (e.g., celebrities)
CREATE TABLE IF NOT EXISTS whitelist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Non-followers table: users who don't follow back
CREATE TABLE IF NOT EXISTS non_followers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ex-followers table: users who used to follow but stopped
CREATE TABLE IF NOT EXISTS ex_followers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  unfollowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_whitelist_username ON whitelist(username);
CREATE INDEX idx_non_followers_username ON non_followers(username);
CREATE INDEX idx_ex_followers_username ON ex_followers(username);