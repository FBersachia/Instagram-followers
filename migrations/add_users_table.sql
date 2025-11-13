-- Create users table for application authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default user: fbersachia / mce775Followers
-- Password hash generated with bcrypt (10 rounds): mce775Followers
INSERT INTO users (username, password_hash)
VALUES ('fbersachia', '$2b$10$40bRmpMv1Z.E1TOQZLqKdeiGyaIUlajXSMq4Pw9.VMHXQ6CQNPiAS')
ON DUPLICATE KEY UPDATE username=username;
