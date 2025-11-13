// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// JSON Upload & Extracted Users
export interface ExtractedUsersResponse {
  count: number;
  usernames: string[];
}

// Whitelist
export interface WhitelistResponse {
  count: number;
  usernames: string[];
}

export interface WhitelistActionResponse {
  username: string;
}

// Non-Followers
export interface NonFollower {
  username: string;
  created_at: string;
}

export interface NonFollowersResponse {
  count: number;
  nonFollowers: NonFollower[];
}

// Ex-Followers
export interface ExFollower {
  username: string;
  unfollowed_at: string;
}

export interface ExFollowersResponse {
  count: number;
  exFollowers: ExFollower[];
}

// Statistics
export interface Stats {
  whitelist: {
    count: number;
  };
  nonFollowers: {
    count: number;
  };
  exFollowers: {
    count: number;
    recent: ExFollower[];
  };
  totalTracked: number;
}

// Follower Counts
export interface FollowerCount {
  id: number;
  count: number;
  recorded_at: string;
  created_at: string;
}

export interface FollowerCountsResponse {
  count: number;
  followerCounts: FollowerCount[];
}
