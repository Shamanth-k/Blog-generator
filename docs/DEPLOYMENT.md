# Deployment

This document covers deployment options for the Blog Generator application.

## Prerequisites

- Node.js 18+ on the target server
- HuggingFace API key
- Domain name (for production)
- SSL certificate (for HTTPS)

## Production Build

### 1. Build the frontend

```bash
cd frontend
npm ci
npm run build
```

This creates a `build/` directory with static files.

### 2. Configure environment

Create `backend/.env` with production values:

```bash
NODE_ENV=production
PORT=5000
HUGGINGFACE_API_KEY=<your-production-api-key>
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
LOG_LEVEL=warn
```

### 3. Start the backend

```bash
cd backend
npm ci --production
npm start
```

## Deployment Options

### Option 1: Traditional Server

Deploy to a VPS or dedicated server (AWS EC2, DigitalOcean, etc.):

1. Install Node.js 18+
2. Clone repository
3. Build frontend
4. Configure environment
5. Use process manager (PM2) for the backend
6. Configure reverse proxy (nginx)

**PM2 setup:**

```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name blog-generator
pm2 save
pm2 startup
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend static files
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health checks
    location /health {
        proxy_pass http://localhost:5000;
    }

    location /ready {
        proxy_pass http://localhost:5000;
    }
}
```

### Option 2: Docker

**Dockerfile for backend:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY src ./src

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
```

**Dockerfile for frontend (with nginx):**

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - CORS_ORIGIN=http://localhost
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

**Run with Docker Compose:**

```bash
export HUGGINGFACE_API_KEY=your_key_here
docker-compose up -d
```

### Option 3: Platform as a Service

#### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**

1. Connect GitHub repository
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Add environment variable for API URL

**Backend on Railway:**

1. Connect GitHub repository
2. Set root directory to `backend`
3. Add environment variables in Railway dashboard
4. Railway auto-detects Node.js and deploys

#### Render

1. Create Web Service for backend
2. Create Static Site for frontend
3. Configure environment variables

## Environment Variables Reference

| Variable | Development | Production | Notes |
|----------|-------------|------------|-------|
| `NODE_ENV` | `development` | `production` | Affects error verbosity |
| `PORT` | `5000` | `5000` | Backend port |
| `HUGGINGFACE_API_KEY` | Your key | Production key | Never commit |
| `CORS_ORIGIN` | `http://localhost:3000` | `https://yourdomain.com` | Frontend URL |
| `RATE_LIMIT_MAX` | `10` | `100` | Adjust based on traffic |
| `LOG_LEVEL` | `debug` | `warn` | Reduce log volume |

## Health Checks

Configure your orchestrator to use these endpoints:

| Endpoint | Purpose | Expected Response |
|----------|---------|-------------------|
| `GET /health` | Liveness probe | 200 OK |
| `GET /ready` | Readiness probe | 200 OK (503 if not ready) |

**Kubernetes example:**

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /ready
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 10
```

## SSL/TLS

For production, always use HTTPS:

1. Obtain certificate (Let's Encrypt recommended)
2. Configure in reverse proxy (nginx) or load balancer
3. Set `CORS_ORIGIN` to HTTPS URL

**Let's Encrypt with Certbot:**

```bash
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

### Logging

Backend outputs structured JSON logs. Forward to your log aggregator:

```bash
pm2 logs blog-generator --json | your-log-shipper
```

### Metrics

Key metrics to monitor:

- Request latency (P50, P95, P99)
- Error rate (4xx, 5xx)
- Rate limit hits
- HuggingFace API response times

## Troubleshooting

### Backend won't start

1. Check `NODE_ENV` and `PORT` are set
2. Verify `HUGGINGFACE_API_KEY` is valid
3. Check logs: `pm2 logs blog-generator`

### Frontend shows CORS error

1. Verify `CORS_ORIGIN` matches frontend URL exactly
2. Include protocol (`https://`)
3. No trailing slash

### AI generation fails

1. Check HuggingFace API status
2. Verify API key has inference permissions
3. Check rate limits on HuggingFace dashboard

### Rate limiting too aggressive

Increase `RATE_LIMIT_MAX` in production:

```bash
RATE_LIMIT_MAX=100  # 100 requests per minute
```
