import { parseInstagramJson, extractUsernames } from '../src/services/jsonParser';

describe('JSON Parser Service', () => {
  describe('parseInstagramJson', () => {
    it('should parse valid Instagram JSON', () => {
      const validJson = JSON.stringify({
        relationships_following: [
          {
            string_list_data: [
              { value: 'user1' },
            ],
          },
        ],
      });

      const result = parseInstagramJson(validJson);
      expect(result).toBeDefined();
      expect(result.relationships_following).toBeDefined();
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = 'invalid json string';
      expect(() => parseInstagramJson(invalidJson)).toThrow();
    });

    it('should throw error for empty string', () => {
      expect(() => parseInstagramJson('')).toThrow();
    });
  });

  describe('extractUsernames', () => {
    it('should extract usernames from valid Instagram data structure', () => {
      const data = {
        relationships_following: [
          {
            string_list_data: [
              { value: 'user1' },
            ],
          },
          {
            string_list_data: [
              { value: 'user2' },
            ],
          },
        ],
      };

      const usernames = extractUsernames(data);
      expect(usernames).toEqual(['user1', 'user2']);
    });

    it('should return empty array if no relationships_following', () => {
      const data = {};
      const usernames = extractUsernames(data);
      expect(usernames).toEqual([]);
    });

    it('should handle missing string_list_data', () => {
      const data = {
        relationships_following: [
          {},
        ],
      };

      const usernames = extractUsernames(data);
      expect(usernames).toEqual([]);
    });

    it('should filter out duplicate usernames', () => {
      const data = {
        relationships_following: [
          {
            string_list_data: [
              { value: 'user1' },
            ],
          },
          {
            string_list_data: [
              { value: 'user1' },
            ],
          },
        ],
      };

      const usernames = extractUsernames(data);
      expect(usernames).toEqual(['user1']);
    });
  });
});