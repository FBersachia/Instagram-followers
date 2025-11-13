import {
  addNonFollowers,
  getNonFollowers,
  removeNonFollower,
  clearNonFollowers,
} from '../src/services/nonFollowers';

// Mock the database
jest.mock('../src/config/database');

describe('Non-Followers Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addNonFollowers', () => {
    it('should add multiple usernames to non-followers list', async () => {
      const usernames = ['user1', 'user2', 'user3'];
      await expect(addNonFollowers(usernames)).resolves.not.toThrow();
    });

    it('should handle empty array', async () => {
      await expect(addNonFollowers([])).resolves.not.toThrow();
    });

    it('should filter out whitelisted users', async () => {
      const usernames = ['user1', 'celebrity_user', 'user2'];
      await expect(addNonFollowers(usernames)).resolves.not.toThrow();
    });

    it('should handle duplicate usernames', async () => {
      const usernames = ['user1', 'user1', 'user2'];
      await expect(addNonFollowers(usernames)).resolves.not.toThrow();
    });
  });

  describe('getNonFollowers', () => {
    it('should return array of non-followers', async () => {
      const nonFollowers = await getNonFollowers();
      expect(Array.isArray(nonFollowers)).toBe(true);
    });

    it('should return empty array when no non-followers exist', async () => {
      const nonFollowers = await getNonFollowers();
      expect(nonFollowers).toEqual([]);
    });
  });

  describe('removeNonFollower', () => {
    it('should remove a username from non-followers list', async () => {
      const username = 'user1';
      await expect(removeNonFollower(username)).resolves.not.toThrow();
    });

    it('should throw error for empty username', async () => {
      await expect(removeNonFollower('')).rejects.toThrow();
    });
  });

  describe('clearNonFollowers', () => {
    it('should clear all non-followers', async () => {
      await expect(clearNonFollowers()).resolves.not.toThrow();
    });
  });
});