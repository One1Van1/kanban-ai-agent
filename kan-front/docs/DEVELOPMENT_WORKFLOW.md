# 🚀 Development Workflow Guide

## Overview

Comprehensive development workflow and automation for efficient development in our AI Kanban Agent project.

## 🔄 Development Lifecycle

## 🔄 Development Lifecycle

### 1. Feature Development Flow

```mermaid
graph LR
    A[Feature Request] --> B[Create Branch]
    B --> C[Implement Feature]
    C --> D[Write Tests]
    D --> E[Run Tests]
    E --> F[Code Review]
    F --> G[Merge to Main]
    G --> H[Deploy]
```

### 2. Git Workflow for Monorepo

```bash
# Create feature branch
git checkout -b feature/kanban-task-filters

# Backend changes (triggers backend CI/CD only)
git add kan-back/
git commit -m "feat(backend): add task filtering API endpoints"

# Frontend changes (triggers frontend CI/CD only)
git add kan-front/
git commit -m "feat(frontend): add task filtering UI components"

# Push and create PR (both pipelines run)
git push origin feature/kanban-task-filters
```

### 3. Commit Convention for Monorepo

```
<type>(<scope>): <description>

# Scoped commits for monorepo clarity
feat(backend): add user authentication API
feat(frontend): add user login form
fix(backend): resolve database connection issue
fix(frontend): resolve mobile navigation bug
docs(monorepo): update deployment guide
test(integration): add e2e user workflow tests
chore(backend): update NestJS dependencies
chore(frontend): update Next.js dependencies
```

## 🎯 Path-Based CI/CD Triggers

### Backend Pipeline Triggers

- Changes in `kan-back/` directory
- Changes in `.github/workflows/backend.yml`
- Database migrations or schema changes

### Frontend Pipeline Triggers

- Changes in `kan-front/` directory
- Changes in `.github/workflows/frontend.yml`
- Public asset or style changes

### Monorepo Pipeline Triggers

- Changes affecting both applications
- Root configuration changes (`package.json`, `docker-compose.yml`)
- Cross-cutting concerns (scripts, documentation)

## 🛠️ Development Scripts

### Enhanced Package.json Scripts for Monorepo

````json
{
  "scripts": {
    "dev": "concurrently \"yarn start:back\" \"yarn start:front\"",
    "start:back": "cd kan-back && yarn start:dev",
    "start:front": "cd kan-front && yarn dev",
    "start:full": "./scripts/start-dev.sh",
    "stop:all": "./scripts/stop-dev.sh",
    "clean": "./scripts/clean-ports.sh",

    "build": "yarn build:back && yarn build:front",
    "build:back": "cd kan-back && yarn build",
    "build:front": "cd kan-front && yarn build",

    "test": "yarn test:back && yarn test:front",
    "test:back": "cd kan-back && yarn test",
    "test:front": "cd kan-front && yarn test",
    "test:e2e": "cd kan-front && yarn test:e2e",
    "test:integration": "cd kan-front && yarn test:e2e:integration",
    "test:all": "yarn test && yarn test:e2e",

    "lint": "yarn lint:back && yarn lint:front",
    "lint:back": "cd kan-back && yarn lint",
    "lint:front": "cd kan-front && yarn lint",
    "lint:fix": "yarn lint:back --fix && yarn lint:front --fix",

    "type-check": "yarn type-check:back && yarn type-check:front",
    "type-check:back": "cd kan-back && yarn tsc --noEmit",
    "type-check:front": "cd kan-front && yarn tsc --noEmit",

    "format": "yarn format:back && yarn format:front",
    "format:back": "cd kan-back && yarn format",
    "format:front": "cd kan-front && yarn format",
    "format:check": "yarn format:back --check && yarn format:front --check",

    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:prod": "docker-compose up",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build",

    "db:reset": "cd kan-back && yarn db:reset",
    "db:seed": "cd kan-back && yarn db:seed",
    "db:migrate": "cd kan-back && yarn db:migrate",
    "db:studio": "cd kan-back && yarn db:studio",

    "setup": "yarn install:all && yarn db:migrate && yarn db:seed",
    "install:all": "yarn install && cd kan-back && yarn install && cd ../kan-front && yarn install",
    "update:all": "yarn upgrade && cd kan-back && yarn upgrade && cd ../kan-front && yarn upgrade",

    "analyze": "yarn analyze:back && yarn analyze:front",
    "analyze:back": "cd kan-back && yarn analyze",
    "analyze:front": "cd kan-front && yarn analyze",

    "audit": "yarn audit:back && yarn audit:front",
    "audit:back": "cd kan-back && yarn audit",
    "audit:front": "cd kan-front && yarn audit"
  }
}
```### Advanced Development Scripts

```bash
#!/bin/bash
# scripts/dev-setup.sh - Complete development environment setup

echo "🚀 Setting up AI Kanban Agent development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install:all

# Setup environment files
if [ ! -f kan-back/.env ]; then
    echo "📝 Creating backend environment file..."
    cp kan-back/.env.example kan-back/.env
fi

if [ ! -f kan-front/.env.local ]; then
    echo "📝 Creating frontend environment file..."
    cp kan-front/.env.example kan-front/.env.local
fi

# Setup database
echo "🗄️ Setting up database..."
cd kan-back
yarn db:migrate
yarn db:seed
cd ..

# Clean ports
echo "🧹 Cleaning ports..."
./scripts/clean-ports.sh

echo "✅ Development environment setup complete!"
echo "Run 'yarn dev' to start development servers"
````

```bash
#!/bin/bash
# scripts/pre-commit.sh - Pre-commit checks

echo "🔍 Running pre-commit checks..."

# Type checking
echo "📝 Type checking..."
yarn type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

# Linting
echo "🔧 Linting..."
yarn lint
if [ $? -ne 0 ]; then
    echo "❌ Lint check failed"
    exit 1
fi

# Tests
echo "🧪 Running tests..."
yarn test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ All pre-commit checks passed!"
```

```bash
#!/bin/bash
# scripts/deploy-check.sh - Pre-deployment validation

echo "🚀 Running deployment checks..."

# Build check
echo "🏗️ Building application..."
yarn build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Full test suite
echo "🧪 Running full test suite..."
yarn test:all
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

# Security audit
echo "🔒 Security audit..."
yarn audit
if [ $? -ne 0 ]; then
    echo "⚠️ Security vulnerabilities found"
fi

echo "✅ Deployment checks complete!"
```

## 🔧 VSCode Configuration

### Workspace Settings

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "jest.jestCommandLine": "yarn test --",
  "jest.autoRun": "watch",
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true
}
```

### Extensions Recommendations

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-playwright.playwright",
    "orta.vscode-jest",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode-remote.remote-containers",
    "github.copilot",
    "github.copilot-chat"
  ]
}
```

### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/kan-back/dist/main.js",
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["--nolazy"],
      "sourceMaps": true,
      "cwd": "${workspaceFolder}/kan-back",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/kan-front/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/kan-front",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/kan-front/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "cwd": "${workspaceFolder}/kan-front",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 🔄 Hot Reload Configuration

### Backend Hot Reload (NestJS)

```typescript
// kan-back/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(3000);

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
```

### Frontend Hot Reload (Next.js)

```javascript
// kan-front/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  // Enable fast refresh
  reactStrictMode: true,

  // Hot reload configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  // API proxy for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

## 🐳 Docker Development

### Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kanban_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./kan-back/db/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  backend:
    build:
      context: ./kan-back
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - ./kan-back:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/kanban_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    command: yarn start:dev

  frontend:
    build:
      context: ./kan-front
      dockerfile: Dockerfile.dev
    ports:
      - '3001:3001'
    volumes:
      - ./kan-front:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3000
    depends_on:
      - backend
    command: yarn dev

volumes:
  postgres_data:
```

## 📊 Performance Monitoring

### Development Performance Scripts

```bash
#!/bin/bash
# scripts/perf-monitor.sh - Performance monitoring during development

echo "📊 Starting performance monitoring..."

# Bundle analyzer for frontend
echo "🔍 Analyzing frontend bundle..."
cd kan-front
yarn analyze

# Memory usage monitoring
echo "🧠 Monitoring memory usage..."
node --inspect=9229 ../kan-back/dist/main.js &
BACKEND_PID=$!

# Performance profiling
echo "⚡ Starting performance profiling..."
sleep 5
curl -X GET http://localhost:3000/health

# Cleanup
kill $BACKEND_PID
echo "✅ Performance monitoring complete!"
```

## 🎯 Quality Gates

### Pre-merge Checklist

```markdown
## Pre-merge Checklist

- [ ] All tests pass (`yarn test:all`)
- [ ] No TypeScript errors (`yarn type-check`)
- [ ] No linting errors (`yarn lint`)
- [ ] Code coverage > 80%
- [ ] E2E tests pass (`yarn test:e2e`)
- [ ] Performance regression check
- [ ] Documentation updated
- [ ] Security audit clean (`yarn audit`)
- [ ] Build succeeds (`yarn build`)
- [ ] Manual testing completed
```

## 🚀 Best Practices

1. **Always use scripts** - Automate repetitive tasks
2. **Hot reload everything** - Fast feedback loops
3. **Monitor performance** - Catch regressions early
4. **Consistent environment** - Docker for reproducibility
5. **Quality gates** - Prevent bad code from merging
6. **Documentation** - Keep guides updated
7. **Debugging tools** - VSCode configuration optimized
8. **Version control** - Meaningful commit messages

This workflow ensures efficient, high-quality development with minimal friction and maximum productivity.
