# Instagram Follower Tracker - REST API

REST API backend for Instagram Follower Tracker application.

## Server Information

- **Base URL**: `http://localhost:3000`
- **Health Check**: `GET /health`

## Starting the Server

```bash
# Development mode with hot-reload
npm run dev:api

# Build TypeScript
npm run build

# Production mode
npm run start:api
```

## API Endpoints

### JSON Upload & Parsing

#### Upload Instagram JSON
```http
POST /api/json/upload
Content-Type: multipart/form-data

Body:
  file: [JSON file]

Response:
{
  "success": true,
  "message": "Successfully extracted N usernames",
  "data": {
    "count": 155,
    "usernames": ["user1", "user2", ...]
  }
}
```

#### Get Extracted Users
```http
GET /api/users/extracted

Response:
{
  "success": true,
  "data": {
    "count": 155,
    "usernames": ["user1", "user2", ...]
  }
}
```

#### Clear Extracted Users Cache
```http
DELETE /api/users/extracted

Response:
{
  "success": true,
  "message": "Extracted users cache cleared"
}
```

### Whitelist Management

#### Get All Whitelist
```http
GET /api/whitelist

Response:
{
  "success": true,
  "data": {
    "count": 5,
    "usernames": ["celebrity1", "celebrity2", ...]
  }
}
```

#### Add User to Whitelist
```http
POST /api/whitelist
Content-Type: application/json

Body:
{
  "username": "celebrity_user"
}

Response:
{
  "success": true,
  "message": "User celebrity_user added to whitelist",
  "data": {
    "username": "celebrity_user"
  }
}
```

#### Check if User in Whitelist
```http
GET /api/whitelist/:username

Response:
{
  "success": true,
  "data": {
    "username": "celebrity_user",
    "isWhitelisted": true
  }
}
```

#### Remove User from Whitelist
```http
DELETE /api/whitelist/:username

Response:
{
  "success": true,
  "message": "User celebrity_user removed from whitelist",
  "data": {
    "username": "celebrity_user"
  }
}
```

#### Add Multiple Users to Whitelist
```http
POST /api/whitelist/bulk
Content-Type: application/json

Body:
{
  "usernames": ["user1", "user2", "user3"]
}

Response:
{
  "success": true,
  "message": "Added 2 users to whitelist",
  "data": {
    "added": ["user1", "user2"],
    "failed": [
      {
        "username": "user3",
        "reason": "Username already exists in whitelist"
      }
    ]
  }
}
```

### Non-Followers Management

#### Get All Non-Followers
```http
GET /api/non-followers

Response:
{
  "success": true,
  "data": {
    "count": 155,
    "usernames": ["user1", "user2", ...]
  }
}
```

#### Insert Non-Followers (Auto-filtered by whitelist)
```http
POST /api/non-followers
Content-Type: application/json

Body:
{
  "usernames": ["user1", "user2", "celebrity1"]
}

Response:
{
  "success": true,
  "message": "Non-followers added successfully (whitelisted users filtered out)",
  "data": {
    "submitted": 3
  }
}
```

#### Remove Non-Follower
```http
DELETE /api/non-followers/:username

Response:
{
  "success": true,
  "message": "User user1 removed from non-followers",
  "data": {
    "username": "user1"
  }
}
```

#### Clear All Non-Followers
```http
DELETE /api/non-followers

Response:
{
  "success": true,
  "message": "All non-followers cleared"
}
```

### Ex-Followers Management

#### Get All Ex-Followers
```http
GET /api/ex-followers

Response:
{
  "success": true,
  "data": {
    "count": 10,
    "exFollowers": [
      {
        "username": "user1",
        "unfollowed_at": "2025-09-30T02:01:22.000Z"
      },
      ...
    ]
  }
}
```

#### Move User to Ex-Followers
```http
POST /api/ex-followers
Content-Type: application/json

Body:
{
  "username": "user1"
}

Response:
{
  "success": true,
  "message": "User user1 moved to ex-followers",
  "data": {
    "username": "user1"
  }
}
```

#### Move Multiple Users to Ex-Followers
```http
POST /api/ex-followers/bulk
Content-Type: application/json

Body:
{
  "usernames": ["user1", "user2", "user3"]
}

Response:
{
  "success": true,
  "message": "Moved 3 users to ex-followers",
  "data": {
    "moved": ["user1", "user2", "user3"],
    "failed": []
  }
}
```

#### Remove Ex-Follower
```http
DELETE /api/ex-followers/:username

Response:
{
  "success": true,
  "message": "User user1 removed from ex-followers",
  "data": {
    "username": "user1"
  }
}
```

### Statistics

#### Get Statistics
```http
GET /api/stats

Response:
{
  "success": true,
  "data": {
    "whitelist": {
      "count": 5
    },
    "nonFollowers": {
      "count": 155
    },
    "exFollowers": {
      "count": 10,
      "recent": [
        {
          "username": "user1",
          "unfollowed_at": "2025-09-30T02:01:22.000Z"
        },
        ...
      ]
    },
    "totalTracked": 165
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Validation Rules

### Username Validation
- Must be alphanumeric with dots (.) and underscores (_)
- Maximum 30 characters
- Minimum 1 character
- Pattern: `/^[a-zA-Z0-9._]{1,30}$/`

### File Upload Validation
- Only JSON files accepted
- Maximum file size: 10MB
- MIME type: `application/json`

## CORS Configuration

The API accepts requests from:
- `http://localhost:5173` (default frontend URL)
- Configurable via `FRONTEND_URL` environment variable

## Environment Variables

```env
# MySQL Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=seguidores

# API Configuration
API_PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Architecture

```
src/
├── controllers/      # Request handlers and business logic
├── routes/          # API route definitions
├── services/        # Database operations
├── middleware/      # Custom middleware (validation, error handling)
├── config/          # Database configuration
├── server.ts        # Express app configuration
└── api.ts          # API entry point
```

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Get stats
curl http://localhost:3000/api/stats

# Add to whitelist
curl -X POST http://localhost:3000/api/whitelist \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user"}'

# Upload JSON file
curl -X POST http://localhost:3000/api/json/upload \
  -F "file=@path/to/usersNotFollowingBack.json"
```
