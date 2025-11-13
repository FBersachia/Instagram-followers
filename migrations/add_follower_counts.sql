-- Create follower_counts table to track follower count over time
CREATE TABLE IF NOT EXISTS follower_counts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  count INT NOT NULL,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
