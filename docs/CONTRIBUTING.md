# Contributing Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- Code editor (VS Code recommended)
- HuggingFace account with API key

## Development Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/your-username/blog-generator.git
cd blog-generator
```

2. Install dependencies:

```bash
npm run install:all
```

3. Configure environment:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your HuggingFace API key.

4. Start development servers:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

5. Verify setup by visiting `http://localhost:3000`

## Project Conventions

### Folder Structure

Backend features follow the controller/service/repository pattern:

```
backend/src/features/<feature>/
├── <feature>.controller.js   # HTTP handlers
├── <feature>.service.js      # Business logic
├── <feature>.repository.js   # Data access
└── index.js                  # Barrel export
```

Frontend features group related components and logic:

```
frontend/src/features/<feature>/
├── <Feature>Input.jsx        # Input components
├── <Feature>Output.jsx       # Output components
├── <feature>.api.js          # API client
├── use<Feature>.js           # Custom hooks
└── index.js                  # Barrel export
```

### Naming Rules

| Type | Convention | Example |
|------|------------|---------|
| Files (JS) | camelCase | `blogService.js` |
| Files (React) | PascalCase | `BlogInput.jsx` |
| Files (CSS) | PascalCase | `BlogInput.css` |
| Functions | camelCase | `generateBlog()` |
| Components | PascalCase | `BlogInput` |
| Constants | SCREAMING_SNAKE | `MAX_PROMPT_LENGTH` |
| CSS classes | BEM | `blog-input__textarea` |

### Code Style

- Use ESLint configuration (errors must be fixed)
- Use Prettier for formatting
- Add JSDoc comments for exported functions
- Keep functions under 30 lines
- One component per file

### Commit Messages

Use conventional commits format:

```
<type>: <description>

[optional body]

[optional footer]
```

Types:

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change without feature/fix |
| `test` | Adding or updating tests |
| `chore` | Build, config, dependencies |

Examples:

```
feat: add blog copy to clipboard button
fix: handle API timeout errors gracefully
docs: update API documentation for rate limits
refactor: extract validation to separate module
test: add unit tests for BlogService
```

## Branching Rules

1. Create feature branches from `main`
2. Branch naming: `<type>/<short-description>`
   - `feat/copy-button`
   - `fix/api-timeout`
   - `docs/api-reference`
3. Keep branches short-lived (< 1 week)
4. Rebase on `main` before creating PR

## Pull Request Process

1. Create feature branch:

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature
```

2. Make changes following conventions above

3. Run tests and linting:

```bash
npm test
npm run lint
```

4. Commit with conventional commit message

5. Push and create PR:

```bash
git push origin feat/your-feature
```

6. Fill out PR template:
   - Description of changes
   - Related issue (if any)
   - Testing performed
   - Screenshots (for UI changes)

7. Address review comments

8. Squash and merge when approved

### PR Requirements

- All tests pass
- No ESLint errors
- Documentation updated (if behavior changed)
- At least one approval

## Testing

### Running Tests

```bash
# All tests
npm test

# Backend only
cd backend && npm test

# Frontend only
cd frontend && npm test

# With coverage
npm run test:coverage
```

### Writing Tests

- Unit test business logic in service layer
- Integration test API endpoints
- Mock external services at repository boundary
- Use descriptive test names

Example test structure:

```javascript
describe('BlogService', () => {
  describe('generateBlog', () => {
    it('should generate blog for valid prompt', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should throw error for empty prompt', async () => {
      // ...
    });
  });
});
```

## Documentation

Update documentation when:

- Adding new endpoints
- Changing request/response formats
- Adding environment variables
- Modifying deployment process

Documentation locations:

| Change | File |
|--------|------|
| API changes | `docs/API.md` |
| Architecture changes | `docs/ARCHITECTURE.md` |
| Deployment changes | `docs/DEPLOYMENT.md` |
| Quick start changes | `README.md` |

## Getting Help

- Check existing issues and documentation
- Open a GitHub issue for bugs or features
- Tag maintainers in PR for urgent reviews
