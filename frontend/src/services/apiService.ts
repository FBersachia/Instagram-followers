import api from './api';
import {
  ApiResponse,
  ExtractedUsersResponse,
  WhitelistResponse,
  WhitelistActionResponse,
  NonFollowersResponse,
  ExFollowersResponse,
  Stats,
  FollowerCountsResponse,
  FollowerCount
} from '../types/api';

// JSON Upload & Extracted Users
export const jsonService = {
  uploadJson: async (file: File): Promise<ApiResponse<ExtractedUsersResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<ExtractedUsersResponse>>(
      '/json/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getExtractedUsers: async (): Promise<ApiResponse<ExtractedUsersResponse>> => {
    const response = await api.get<ApiResponse<ExtractedUsersResponse>>('/users/extracted');
    return response.data;
  },

  clearExtractedUsers: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>('/users/extracted');
    return response.data;
  },
};

// Whitelist
export const whitelistService = {
  getAll: async (): Promise<ApiResponse<WhitelistResponse>> => {
    const response = await api.get<ApiResponse<WhitelistResponse>>('/whitelist');
    return response.data;
  },

  add: async (username: string): Promise<ApiResponse<WhitelistActionResponse>> => {
    const response = await api.post<ApiResponse<WhitelistActionResponse>>('/whitelist', {
      username,
    });
    return response.data;
  },

  addBulk: async (usernames: string[]): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/whitelist/bulk', {
      usernames,
    });
    return response.data;
  },

  remove: async (username: string): Promise<ApiResponse<WhitelistActionResponse>> => {
    const response = await api.delete<ApiResponse<WhitelistActionResponse>>(
      `/whitelist/${username}`
    );
    return response.data;
  },

  check: async (username: string): Promise<ApiResponse<{ username: string; isWhitelisted: boolean }>> => {
    const response = await api.get<ApiResponse<{ username: string; isWhitelisted: boolean }>>(
      `/whitelist/${username}`
    );
    return response.data;
  },
};

// Non-Followers
export const nonFollowersService = {
  getAll: async (): Promise<ApiResponse<NonFollowersResponse>> => {
    const response = await api.get<ApiResponse<NonFollowersResponse>>('/non-followers');
    return response.data;
  },

  insert: async (usernames: string[]): Promise<ApiResponse<{ submitted: number }>> => {
    const response = await api.post<ApiResponse<{ submitted: number }>>('/non-followers', {
      usernames,
    });
    return response.data;
  },

  remove: async (username: string): Promise<ApiResponse<WhitelistActionResponse>> => {
    const response = await api.delete<ApiResponse<WhitelistActionResponse>>(
      `/non-followers/${username}`
    );
    return response.data;
  },

  clearAll: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>('/non-followers');
    return response.data;
  },
};

// Ex-Followers
export const exFollowersService = {
  getAll: async (): Promise<ApiResponse<ExFollowersResponse>> => {
    const response = await api.get<ApiResponse<ExFollowersResponse>>('/ex-followers');
    return response.data;
  },

  add: async (username: string): Promise<ApiResponse<WhitelistActionResponse>> => {
    const response = await api.post<ApiResponse<WhitelistActionResponse>>('/ex-followers', {
      username,
    });
    return response.data;
  },

  addBulk: async (usernames: string[]): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/ex-followers/bulk', {
      usernames,
    });
    return response.data;
  },

  remove: async (username: string): Promise<ApiResponse<WhitelistActionResponse>> => {
    const response = await api.delete<ApiResponse<WhitelistActionResponse>>(
      `/ex-followers/${username}`
    );
    return response.data;
  },
};

// Statistics
export const statsService = {
  get: async (): Promise<ApiResponse<Stats>> => {
    const response = await api.get<ApiResponse<Stats>>('/stats');
    return response.data;
  },
};

// Follower Counts
export const followerCountsService = {
  getAll: async (limit?: number): Promise<ApiResponse<FollowerCountsResponse>> => {
    const url = limit ? `/follower-counts?limit=${limit}` : '/follower-counts';
    const response = await api.get<ApiResponse<FollowerCountsResponse>>(url);
    return response.data;
  },

  getLatest: async (): Promise<ApiResponse<FollowerCount | null>> => {
    const response = await api.get<ApiResponse<FollowerCount | null>>('/follower-counts/latest');
    return response.data;
  },

  add: async (count: number): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.post<ApiResponse<{ count: number }>>('/follower-counts', {
      count,
    });
    return response.data;
  },

  remove: async (id: number): Promise<ApiResponse<{ id: number }>> => {
    const response = await api.delete<ApiResponse<{ id: number }>>(`/follower-counts/${id}`);
    return response.data;
  },
};
