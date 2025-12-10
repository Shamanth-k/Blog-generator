# Architecture

This document describes the system architecture, component boundaries, and design decisions.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP (port 3000 dev / 80 prod)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React SPA)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    Hero      │  │   Features   │  │  BlogInput   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  BlogOutput  │  │ LoadingState │  │ ErrorMessage │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                          │                                      │
│                    ┌─────┴─────┐                                │
│                    │ blog.api  │ API Client                     │
│                    └───────────┘                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP POST /api/v1/blog/generate
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                         │
│                                                                 │
│  ┌────────────────────── Middleware ──────────────────────┐     │
│  │  Helmet │ CORS │ Rate Limiter │ Trace ID │ JSON Parser │     │
│  └────────────────────────────────────────────────────────┘     │
│                          │                                      │
│  ┌───────────────────────┴────────────────────────────────┐     │
│  │                     Router                             │     │
│  │   /api/v1/blog/*  →  Blog Controller                   │     │
│  │   /health         →  Health Controller                 │     │
│  │   /ready          →  Health Controller                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                          │                                      │
│  ┌───────────────── Feature: Blog ────────────────────────┐     │
│  │  Controller → Service → Repository                     │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS POST /v1/chat/completions
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HuggingFace Inference API                     │
│                   (Qwen/Qwen2.5-72B-Instruct)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Layers

### Frontend Architecture

```
frontend/src/
├── features/              Feature-based modules
│   └── blog/
│       ├── BlogInput.jsx         UI: Prompt input form
│       ├── BlogOutput.jsx        UI: Generated blog display
│       ├── blog.api.js           Data: API client
│       ├── useBlogGeneration.js  State: Hook for blog state
│       └── index.js              Barrel export
│
├── components/            Shared presentational components
│   ├── Hero.jsx                  Landing section
│   ├── Features.jsx              Feature showcase
│   ├── ErrorBoundary.jsx         Error boundary wrapper
│   ├── ErrorMessage.jsx          Error display
│   ├── LoadingState.jsx          Loading indicator
│   └── Animated.jsx              Animation wrappers
│
├── design/                Animation system
│   ├── motion.js                 Motion tokens and variants
│   ├── MotionProvider.jsx        Animation context provider
│   └── useReducedMotion.js       Accessibility hook
│
└── styles/
    └── global.css                CSS custom properties
```

**Data Flow:**
1. User enters prompt in BlogInput
2. useBlogGeneration hook manages state
3. blog.api.js sends POST request to backend
4. Response updates state, BlogOutput renders markdown

### Backend Architecture

```
backend/src/
├── features/              Feature-based modules
│   ├── blog/
│   │   ├── blog.controller.js    HTTP handlers
│   │   ├── blog.service.js       Business logic
│   │   ├── blog.repository.js    External API calls
│   │   └── index.js              Barrel export
│   └── health/
│       ├── health.controller.js  Health endpoints
│       └── index.js
│
├── infra/                 Infrastructure concerns
│   ├── config.js                 Environment configuration
│   ├── logger.js                 Structured JSON logging
│   └── index.js
│
├── middleware/            Express middleware
│   └── index.js                  Security, CORS, rate limiting
│
└── server.js              Application entry point
```

**Request Flow:**
1. Request enters through middleware chain
2. Router dispatches to appropriate controller
3. Controller validates input, calls service
4. Service applies business logic, calls repository
5. Repository communicates with external APIs
6. Response flows back through layers

### Layer Responsibilities

| Layer | Responsibility | Dependencies |
|-------|---------------|--------------|
| Controller | HTTP handling, request validation, response formatting | Service |
| Service | Business logic, orchestration, data transformation | Repository |
| Repository | External API communication, data persistence | External services |
| Middleware | Cross-cutting concerns (auth, logging, security) | None |
| Infrastructure | Configuration, logging, shared utilities | None |

## Design Decisions

### 1. Feature-based folder structure

Code is organized by feature rather than technical layer. This improves:
- Discoverability: All blog-related code is in one place
- Modularity: Features can be developed and tested independently
- Scalability: New features don't clutter existing directories

### 2. Layered architecture in backend

Each feature follows controller/service/repository pattern:
- Separation of concerns
- Testability (each layer can be mocked)
- Single responsibility per file

### 3. Single-page application

The frontend is a single React page with:
- No routing complexity
- Fast initial load
- Smooth scroll between sections

### 4. Animation system

Centralized animation tokens and providers:
- Consistent motion across components
- Respects prefers-reduced-motion
- Easy to maintain and update

### 5. Rate limiting

Protects against abuse and API quota exhaustion:
- 10 requests per minute per IP
- Returns 429 with retry information

## External Dependencies

| Service | Purpose | Failure Mode |
|---------|---------|--------------|
| HuggingFace Inference API | Blog generation | 503 returned to client |

## Security Considerations

1. **Helmet**: Sets security headers (CSP, HSTS, etc.)
2. **CORS**: Restricts origins in production
3. **Rate limiting**: Prevents abuse
4. **Input validation**: Sanitizes prompts before AI processing
5. **No secrets in frontend**: API key stays on backend

## Scalability Notes

Current architecture supports:
- Horizontal scaling of backend (stateless)
- Frontend can be served from CDN
- Rate limiting per-instance (consider Redis for distributed)

For higher scale:
- Add caching layer for repeated prompts
- Queue long-running generation requests
- Consider WebSocket for streaming responses
