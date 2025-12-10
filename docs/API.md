# API Documentation

## Base URL

Development: `http://localhost:5000`
Production: `https://api.yourdomain.com`

API version prefix: `/api/v1`

## Authentication

The API does not require authentication. Rate limiting is applied per IP address.

## Rate Limiting

| Parameter | Value |
|-----------|-------|
| Window | 60 seconds |
| Max requests | 10 (configurable) |
| Status code | 429 Too Many Requests |

Response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |

## Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` for POST requests |
| `X-Trace-Id` | No | Custom trace ID for request tracking |

## Response Headers

| Header | Description |
|--------|-------------|
| `X-Trace-Id` | Trace ID (echoed or generated) |
| `Content-Type` | Always `application/json` |

## Endpoints

### POST /api/v1/blog/generate

Generate a blog post from a text prompt.

**Request:**

```http
POST /api/v1/blog/generate HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "prompt": "The benefits of morning meditation"
}
```

**Request body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `prompt` | string | Yes | 3-500 characters | Topic for blog generation |

**Success response (200):**

```json
{
  "success": true,
  "blog": "# The Benefits of Morning Meditation\n\n...",
  "prompt": "The benefits of morning meditation",
  "meta": {
    "wordCount": 1023,
    "model": "Qwen/Qwen2.5-72B-Instruct",
    "generatedAt": 1702234567890
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful requests |
| `blog` | string | Generated blog in Markdown format |
| `prompt` | string | Echo of the original prompt |
| `meta.wordCount` | number | Word count of generated blog |
| `meta.model` | string | AI model used |
| `meta.generatedAt` | number | Unix timestamp of generation |

**Error response (400):**

```json
{
  "success": false,
  "error": "Prompt must be at least 3 characters",
  "code": "INVALID_PROMPT",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error response (503):**

```json
{
  "success": false,
  "error": "Model is loading. Please try again in a few seconds.",
  "code": "MODEL_LOADING",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### GET /health

Liveness check. Returns 200 if the server is running.

**Response (200):**

```json
{
  "status": "healthy",
  "timestamp": "2024-12-10T12:00:00.000Z",
  "version": "v1",
  "uptime": 3600
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `healthy` |
| `timestamp` | string | ISO 8601 timestamp |
| `version` | string | API version |
| `uptime` | number | Server uptime in seconds |

---

### GET /ready

Readiness check. Returns 200 if the server can handle requests.

**Response (200):**

```json
{
  "ready": true,
  "checks": {
    "api": true
  },
  "timestamp": "2024-12-10T12:00:00.000Z"
}
```

**Response (503):**

```json
{
  "ready": false,
  "checks": {
    "api": false
  },
  "timestamp": "2024-12-10T12:00:00.000Z"
}
```

## Error Codes

| Code | HTTP Status | Description | Action |
|------|-------------|-------------|--------|
| `INVALID_PROMPT` | 400 | Prompt validation failed | Check prompt length (3-500 chars) |
| `GENERATION_FAILED` | 500 | AI model failed to generate | Retry after delay |
| `MODEL_LOADING` | 503 | AI model is warming up | Retry after 10-30 seconds |
| `RATE_LIMITED` | 429 | Too many requests | Wait for rate limit window reset |
| `INTERNAL_ERROR` | 500 | Unexpected server error | Contact support if persistent |
| `NOT_FOUND` | 404 | Endpoint not found | Check endpoint path |

## Example Usage

### cURL

```bash
curl -X POST http://localhost:5000/api/v1/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Benefits of remote work"}'
```

### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:5000/api/v1/blog/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Benefits of remote work'
  }),
});

const data = await response.json();

if (data.success) {
  console.log(data.blog);
} else {
  console.error(data.error);
}
```

### Python (requests)

```python
import requests

response = requests.post(
    'http://localhost:5000/api/v1/blog/generate',
    json={'prompt': 'Benefits of remote work'}
)

data = response.json()

if data['success']:
    print(data['blog'])
else:
    print(f"Error: {data['error']}")
```
