# 🔄 GitHub Repository Setup Guide

## Overview

Complete guide for setting up separate CI/CD pipelines for backend and frontend in a single GitHub repository.

## 🎯 Repository Structure Benefits

### ✅ **Single Repository Advantages**

- **Unified Issue Tracking** - All features, bugs, and discussions in one place
- **Coordinated Releases** - Version backend and frontend together
- **Shared Documentation** - Single source of truth for project info
- **Team Collaboration** - All developers have access to full codebase
- **Dependency Management** - Shared tooling and configurations

### ⚡ **Separate CI/CD Advantages**

- **Independent Deployments** - Deploy backend and frontend separately
- **Optimized Build Times** - Only build what changed
- **Isolated Testing** - Backend tests don't affect frontend builds
- **Resource Efficiency** - Reduced CI/CD costs and faster feedback
- **Team Independence** - Backend and frontend teams work independently

## 🏗️ Setup Steps

### 1. Repository Structure

```
kanban-ai-agent/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml      # 🏗️ Backend CI/CD
│   │   ├── frontend.yml     # 🎨 Frontend CI/CD
│   │   └── monorepo.yml     # 🔄 Orchestration
│   └── dependabot.yml       # 🤖 Dependency updates
├── kan-back/                # 🏗️ Backend code
├── kan-front/               # 🎨 Frontend code
├── scripts/                 # 🛠️ Shared scripts
├── docker-compose*.yml      # 🐳 Development environment
├── package.json             # 📦 Root workspace
└── README.md                # 📚 Project documentation
```

### 2. Path-Based Triggering

Each workflow triggers only when relevant files change:

```yaml
# Backend workflow triggers
on:
  push:
    paths:
      - 'kan-back/**'
      - '.github/workflows/backend.yml'

# Frontend workflow triggers
on:
  push:
    paths:
      - 'kan-front/**'
      - '.github/workflows/frontend.yml'
```

### 3. Smart Change Detection

The monorepo workflow uses path filtering:

```yaml
- name: 🔍 Detect changes
  uses: dorny/paths-filter@v2
  id: changes
  with:
    filters: |
      backend:
        - 'kan-back/**'
      frontend:
        - 'kan-front/**'
      root:
        - 'package.json'
        - 'docker-compose*.yml'
```

## 🔧 GitHub Settings Configuration

### 1. Branch Protection Rules

**Main Branch Protection**:

```
Branch name pattern: main
☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
   - Backend CI/CD
   - Frontend CI/CD
   - Integration Tests
☑️ Require branches to be up to date before merging
☑️ Require linear history
☑️ Include administrators
```

**Development Branch Protection**:

```
Branch name pattern: dev
☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
   - Backend CI/CD
   - Frontend CI/CD
☑️ Require branches to be up to date before merging
```

### 2. Required Status Checks

Configure these status checks as required:

- `Backend CI/CD / Code Quality`
- `Backend CI/CD / Unit Tests`
- `Frontend CI/CD / Code Quality`
- `Frontend CI/CD / Unit Tests`
- `Frontend CI/CD / E2E Tests`
- `Monorepo CI/CD / Integration Tests`

### 3. Repository Secrets

Add these secrets in GitHub repository settings:

```bash
# Database & Infrastructure
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379

# API Keys & External Services
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-...
JIRA_API_KEY=...

# Deployment
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
RAILWAY_TOKEN=...

# Monitoring & Analytics
CODECOV_TOKEN=...
SENTRY_DSN=...
LHCI_GITHUB_APP_TOKEN=...
```

## 🎯 Workflow Strategies

### 1. **Independent Development**

```bash
# Backend developer workflow
git checkout -b feature/backend-auth-api
# Make backend changes in kan-back/
git commit -m "feat(backend): add authentication API"
git push origin feature/backend-auth-api
# Only backend CI/CD pipeline runs
```

```bash
# Frontend developer workflow
git checkout -b feature/frontend-login-form
# Make frontend changes in kan-front/
git commit -m "feat(frontend): add login form component"
git push origin feature/frontend-login-form
# Only frontend CI/CD pipeline runs
```

### 2. **Full-Stack Features**

```bash
# Full-stack feature workflow
git checkout -b feature/user-management
# Make changes in both kan-back/ and kan-front/
git commit -m "feat(backend): add user management API"
git commit -m "feat(frontend): add user management UI"
git push origin feature/user-management
# Both backend and frontend CI/CD pipelines run
# Integration tests ensure compatibility
```

### 3. **Hotfix Deployment**

```bash
# Emergency backend fix
git checkout -b hotfix/backend-security-patch
# Fix in kan-back/ only
git commit -m "fix(backend): patch security vulnerability"
git push origin hotfix/backend-security-patch
# Only backend builds and deploys
# Frontend remains unaffected
```

## 📊 Monitoring & Dashboards

### 1. **GitHub Actions Dashboard**

Monitor workflow status:

- Backend CI/CD status and trends
- Frontend CI/CD status and trends
- Integration test results
- Deployment success rates

### 2. **Code Coverage Tracking**

Separate coverage reports:

- Backend coverage via Codecov
- Frontend coverage via Codecov
- Combined coverage visualization
- Trend analysis over time

### 3. **Performance Monitoring**

Track build performance:

- Backend build times
- Frontend build times
- Test execution times
- Deployment durations

## 🚀 Deployment Strategies

### 1. **Independent Deployments**

```yaml
# Backend deployment
- name: 🚀 Deploy Backend
  if: needs.backend.result == 'success'
  run: |
    # Deploy to Railway/Heroku
    railway deploy

# Frontend deployment
- name: 🚀 Deploy Frontend
  if: needs.frontend.result == 'success'
  run: |
    # Deploy to Vercel/Netlify
    vercel deploy --prod
```

### 2. **Coordinated Deployments**

```yaml
# Deploy both if integration tests pass
deploy:
  needs: [backend, frontend, integration]
  if: |
    needs.backend.result == 'success' &&
    needs.frontend.result == 'success' &&
    needs.integration.result == 'success'
```

### 3. **Environment-Specific Deployments**

```yaml
# Development environment
- name: 🚀 Deploy to Dev
  if: github.ref == 'refs/heads/dev'

# Staging environment
- name: 🚀 Deploy to Staging
  if: github.ref == 'refs/heads/staging'

# Production environment
- name: 🚀 Deploy to Production
  if: github.ref == 'refs/heads/main'
```

## 🎯 Best Practices

### 1. **Conventional Commits**

Use scoped commits for clarity:

```bash
feat(backend): add user authentication
fix(frontend): resolve mobile navigation bug
docs(monorepo): update deployment guide
test(integration): add e2e user flow tests
chore(deps): update backend dependencies
```

### 2. **Pull Request Templates**

Create `.github/pull_request_template.md`:

```markdown
## 🎯 Changes

- [ ] Backend changes in `kan-back/`
- [ ] Frontend changes in `kan-front/`
- [ ] Documentation updates
- [ ] Breaking changes

## 🧪 Testing

- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## 📊 Impact

- [ ] Performance impact assessed
- [ ] Security implications reviewed
- [ ] Accessibility considerations
```

### 3. **Issue Templates**

Create issue templates for:

- Backend bugs
- Frontend bugs
- Feature requests
- Infrastructure issues
- Documentation improvements

## 🔄 Migration Strategy

If migrating from separate repositories:

### 1. **Preparation**

```bash
# Create new monorepo structure
mkdir kanban-ai-agent
cd kanban-ai-agent
git init

# Create workspace directories
mkdir kan-back kan-front .github/workflows
```

### 2. **Backend Migration**

```bash
# Add backend as subtree
git subtree add --prefix=kan-back backend-repo main --squash

# Or move files manually
cp -r ../backend-repo/* kan-back/
```

### 3. **Frontend Migration**

```bash
# Add frontend as subtree
git subtree add --prefix=kan-front frontend-repo main --squash

# Or move files manually
cp -r ../frontend-repo/* kan-front/
```

### 4. **Workflow Setup**

```bash
# Copy our GitHub workflows
cp workflows/* .github/workflows/

# Update package.json for workspace
# Configure root scripts and dependencies
```

This setup gives you the best of both worlds: unified project management with independent deployment capabilities!
