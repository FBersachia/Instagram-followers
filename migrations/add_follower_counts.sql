-- Create follower_counts table to track follower count over time
CREATE TABLE IF NOT EXISTS follower_counts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  count INT NOT NULL,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recorded_at (recorded_at),
  INDEX idx_user_recorded_at (user_id, recorded_at),
  CONSTRAINT fk_follower_counts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
