# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Upload endpoints**: 20 requests per hour per IP
- **General API**: 100 requests per 15 minutes per IP
- **Admin endpoints**: 50 requests per 15 minutes per IP

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": [] // Optional validation details
  }
}
```

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Validation:**
- Email must be valid format
- Password minimum 6 characters
- Name is required

**Rate Limit:** 5 requests per 15 minutes

---

### Login

**POST** `/auth/login`

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Admin Login

**POST** `/auth/admin/login`

Authenticate admin user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user_id",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

---

### Logout

**POST** `/auth/logout`

Logout user (client should remove tokens).

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## File Endpoints

### Upload File

**POST** `/files/upload`

Upload a new file.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file`: File to upload (required)
- `maxDownloads`: Maximum download count (optional, default: 0 = unlimited)
- `expiryHours`: Expiration time in hours (optional, default: 24)
- `visibility`: File visibility - "private" or "public" (optional, default: "private")

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_id",
      "name": "document.pdf",
      "size": 1048576,
      "type": "application/pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "accessToken": "unique_access_token",
      "expiryTimestamp": "2024-01-02T00:00:00.000Z",
      "maxDownloads": 5,
      "downloadCount": 0,
      "visibility": "private",
      "isRevoked": false,
      "uploadedBy": {
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  }
}
```

**Validation:**
- File size: Maximum 50MB
- Supported file types: Images, PDFs, Documents, Archives, Code files, Audio, Video
- Dangerous file types (.exe, .bat, etc.) are blocked

**Rate Limit:** 20 uploads per hour

---

### Get User Files

**GET** `/files`

Get all files uploaded by authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file_id",
        "name": "document.pdf",
        "size": 1048576,
        "type": "application/pdf",
        "uploadedAt": "2024-01-01T00:00:00.000Z",
        "accessToken": "unique_access_token",
        "expiryTimestamp": "2024-01-02T00:00:00.000Z",
        "maxDownloads": 5,
        "downloadCount": 2,
        "visibility": "private",
        "isRevoked": false
      }
    ]
  }
}
```

---

### Get File by ID

**GET** `/files/:id`

Get details of a specific file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_id",
      "name": "document.pdf",
      "size": 1048576,
      "type": "application/pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "accessToken": "unique_access_token",
      "expiryTimestamp": "2024-01-02T00:00:00.000Z",
      "maxDownloads": 5,
      "downloadCount": 2,
      "visibility": "private",
      "isRevoked": false,
      "uploadedBy": {
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  }
}
```

---

### Access File by Token

**GET** `/files/access/:token`

Get file information using access token.

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "name": "document.pdf",
      "size": 1048576,
      "type": "application/pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "downloadCount": 2,
      "maxDownloads": 5
    }
  }
}
```

---

### Download File

**GET** `/files/download/:token`

Download file using access token.

**Response:**
- File download (binary data)
- Headers include Content-Disposition for filename

---

### Regenerate Access Token

**PATCH** `/files/:id/regenerate-token`

Generate a new access token for a file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_id",
      "accessToken": "new_unique_access_token"
    }
  }
}
```

---

### Revoke File Access

**PATCH** `/files/:id/revoke`

Revoke access to a file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_id",
      "isRevoked": true
    }
  }
}
```

---

### Delete File

**DELETE** `/files/:id`

Permanently delete a file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "File deleted successfully"
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication with an admin role.

### Get Admin Statistics

**GET** `/admin/stats`

Get system-wide statistics.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalFiles": 1250,
    "totalDownloads": 5480,
    "activeFiles": 980,
    "revokedFiles": 200,
    "expiredFiles": 70,
    "storageUsed": 5368709120,
    "recentActivity": [
      {
        "fileId": "file_id",
        "eventType": "download",
        "status": "success",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Rate Limit:** 50 requests per 15 minutes

---

### Get All Users

**GET** `/admin/users`

Get list of all users.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "userId": "user_id",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "filesCount": 15,
        "totalDownloads": 45
      }
    ]
  }
}
```

---

### Get All Files

**GET** `/admin/files`

Get list of all files in the system.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file_id",
        "name": "document.pdf",
        "size": 1048576,
        "uploadedBy": {
          "name": "John Doe",
          "email": "user@example.com"
        },
        "downloadCount": 5,
        "isRevoked": false,
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Activity Endpoints

### Get File Activities

**GET** `/activities/file/:fileId`

Get activity logs for a specific file.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_id",
        "fileId": "file_id",
        "eventType": "download",
        "status": "success",
        "details": "File downloaded successfully",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `USER_EXISTS` | User already exists |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `INVALID_ADMIN_CREDENTIALS` | Invalid admin credentials |
| `NOT_AUTHENTICATED` | Authentication required |
| `NO_REFRESH_TOKEN` | Refresh token missing |
| `INVALID_REFRESH_TOKEN` | Invalid or expired refresh token |
| `NO_FILE` | No file uploaded |
| `FILE_NOT_FOUND` | File not found |
| `FILE_REVOKED` | File access has been revoked |
| `FILE_EXPIRED` | File has expired |
| `DOWNLOAD_LIMIT_REACHED` | Maximum download limit reached |
| `UNAUTHORIZED` | Insufficient permissions |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `AUTH_RATE_LIMIT_EXCEEDED` | Too many authentication attempts |
| `UPLOAD_RATE_LIMIT_EXCEEDED` | Too many file uploads |

---

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Examples

### Upload and Share a File

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 2. Upload file
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/file.pdf" \
  -F "maxDownloads=5" \
  -F "expiryHours=24" \
  -F "visibility=private"

# 3. Share the access token from response
# Anyone with the token can download: /files/download/<access_token>
```

---

## Webhook Events (Future Enhancement)

Coming soon: Webhook support for file events.

---

## Pagination (Future Enhancement)

Coming soon: Pagination support for list endpoints.

---

For more information, see the [main README](../README.md).
