interface StringListData {
  value: string;
}

interface RelationshipItem {
  string_list_data?: StringListData[];
}

interface InstagramData {
  relationships_following?: RelationshipItem[];
}

interface InstagramUser {
  username: string;
  id?: string;
  full_name?: string;
}

export function parseInstagramJson(jsonString: string): any {
  if (!jsonString || jsonString.trim() === '') {
    throw new Error('JSON string cannot be empty');
  }

  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function extractUsernames(data: any): string[] {
  const usernames: string[] = [];
  const seenUsernames = new Set<string>();

  // Format 1: Array of user objects [{ username: "...", ... }]
  if (Array.isArray(data)) {
    for (const user of data) {
      if (user.username && !seenUsernames.has(user.username)) {
        usernames.push(user.username);
        seenUsernames.add(user.username);
      }
    }
    return usernames;
  }

  // Format 2: Object with relationships_following
  if (data.relationships_following && Array.isArray(data.relationships_following)) {
    for (const relationship of data.relationships_following) {
      if (relationship.string_list_data && Array.isArray(relationship.string_list_data)) {
        for (const item of relationship.string_list_data) {
          if (item.value && !seenUsernames.has(item.value)) {
            usernames.push(item.value);
            seenUsernames.add(item.value);
          }
        }
      }
    }
    return usernames;
  }

  return [];
}