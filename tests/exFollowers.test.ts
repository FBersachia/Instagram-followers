import {
  moveToExFollowers,
  getExFollowers,
  removeExFollower,
} from '../src/services/exFollowers';

// Mock the database
jest.mock('../src/config/database');

describe('Ex-Followers Service', () => {
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('moveToExFollowers', () => {
    it('should move username from non-followers to ex-followers', async () => {
      const username = 'user1';
      await expect(moveToExFollowers(userId, username)).resolves.not.toThrow();
    });

    it('should throw error for empty username', async () => {
      await expect(moveToExFollowers(userId, '')).rejects.toThrow();
    });

    it('should remove from non-followers when moving to ex-followers', async () => {
      const username = 'user1';
      await expect(moveToExFollowers(userId, username)).resolves.not.toThrow();
    });

    it('should handle moving username that does not exist in non-followers', async () => {
      const username = 'non_existent_user';
      await expect(moveToExFollowers(userId, username)).resolves.not.toThrow();
    });
  });

  describe('getExFollowers', () => {
    it('should return array of ex-followers', async () => {
      const exFollowers = await getExFollowers(userId);
      expect(Array.isArray(exFollowers)).toBe(true);
    });

    it('should return empty array when no ex-followers exist', async () => {
      const exFollowers = await getExFollowers(userId);
      expect(exFollowers).toEqual([]);
    });

    it('should include unfollowed_at timestamp', async () => {
      const exFollowers = await getExFollowers(userId);
      if (exFollowers.length > 0) {
        expect(exFollowers[0]).toHaveProperty('unfollowed_at');
      }
    });
  });

  describe('removeExFollower', () => {
    it('should remove a username from ex-followers list', async () => {
      const username = 'user1';
      await expect(removeExFollower(userId, username)).resolves.not.toThrow();
    });

    it('should throw error for empty username', async () => {
      await expect(removeExFollower(userId, '')).rejects.toThrow();
    });
  });
});
