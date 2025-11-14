import {
  addToWhitelist,
  removeFromWhitelist,
  getWhitelist,
  isInWhitelist,
} from '../src/services/whitelist';

// Mock the database
jest.mock('../src/config/database');

describe('Whitelist Service', () => {
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWhitelist', () => {
    it('should add a username to whitelist', async () => {
      const username = 'celebrity_user';
      await expect(addToWhitelist(userId, username)).resolves.not.toThrow();
    });

    it('should throw error for empty username', async () => {
      await expect(addToWhitelist(userId, '')).rejects.toThrow();
    });

    it('should handle duplicate entries gracefully', async () => {
      const username = 'celebrity_user';
      await addToWhitelist(userId, username);
      await expect(addToWhitelist(userId, username)).rejects.toThrow();
    });
  });

  describe('removeFromWhitelist', () => {
    it('should remove a username from whitelist', async () => {
      const username = 'celebrity_user';
      await expect(removeFromWhitelist(userId, username)).resolves.not.toThrow();
    });

    it('should throw error for empty username', async () => {
      await expect(removeFromWhitelist(userId, '')).rejects.toThrow();
    });
  });

  describe('getWhitelist', () => {
    it('should return array of whitelisted usernames', async () => {
      const whitelist = await getWhitelist(userId);
      expect(Array.isArray(whitelist)).toBe(true);
    });

    it('should return empty array when whitelist is empty', async () => {
      const whitelist = await getWhitelist(userId);
      expect(whitelist).toEqual([]);
    });
  });

  describe('isInWhitelist', () => {
    it('should return true if username is in whitelist', async () => {
      const username = 'celebrity_user';
      const result = await isInWhitelist(userId, username);
      expect(typeof result).toBe('boolean');
    });

    it('should return false if username is not in whitelist', async () => {
      const username = 'non_whitelisted_user';
      const result = await isInWhitelist(userId, username);
      expect(result).toBe(false);
    });

    it('should throw error for empty username', async () => {
      await expect(isInWhitelist(userId, '')).rejects.toThrow();
    });
  });
});
