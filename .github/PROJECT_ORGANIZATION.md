# 🎯 GitHub Project Organization

## Board Structure

### 📊 **Main Project Board**
- **Backlog** - Все новые задачи
- **Backend In Progress** - Задачи бэкенда в работе
- **Frontend In Progress** - Задачи фронтенда в работе
- **Integration** - Задачи, требующие обе части
- **Testing** - Тестирование и QA
- **Done** - Завершенные задачи

### 🏷️ **Labels для разделения**

#### Компоненты:
- `🏗️ backend` - Задачи бэкенда
- `🎨 frontend` - Задачи фронтенда
- `🔄 fullstack` - Задачи, затрагивающие обе части
- `🧪 testing` - Тестирование
- `📚 docs` - Документация
- `🐳 devops` - CI/CD, Docker, инфраструктура

#### Типы:
- `✨ feature` - Новая функциональность
- `🐛 bug` - Исправление багов
- `🔧 maintenance` - Техническое обслуживание
- `📈 enhancement` - Улучшения
- `🔒 security` - Безопасность

#### Приоритеты:
- `🔥 critical` - Критично
- `⚡ high` - Высокий
- `📋 medium` - Средний
- `📝 low` - Низкий

### 📋 **Issue Templates**

#### Backend Issue Template:
```markdown
---
name: 🏗️ Backend Issue
about: Backend-related task or bug
title: '[BACKEND] '
labels: '🏗️ backend'
assignees: ''
---

## 🎯 Description
Brief description of the backend task/issue

## 📋 Requirements
- [ ] API endpoint implementation
- [ ] Database changes
- [ ] Tests
- [ ] Documentation

## 🔧 Technical Details
- **Affected modules**: 
- **Database changes**: Yes/No
- **Breaking changes**: Yes/No

## ✅ Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## 🧪 Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] API tests
```

#### Frontend Issue Template:
```markdown
---
name: 🎨 Frontend Issue
about: Frontend-related task or bug
title: '[FRONTEND] '
labels: '🎨 frontend'
assignees: ''
---

## 🎯 Description
Brief description of the frontend task/issue

## 📋 Requirements
- [ ] Component implementation
- [ ] UI/UX changes
- [ ] Tests
- [ ] Documentation

## 🎨 Design Details
- **Affected components**: 
- **Design system**: Yes/No
- **Mobile responsive**: Yes/No

## ✅ Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## 🧪 Testing
- [ ] Unit tests
- [ ] E2E tests
- [ ] Visual regression tests
```

#### Full-Stack Issue Template:
```markdown
---
name: 🔄 Full-Stack Issue
about: Task affecting both backend and frontend
title: '[FULLSTACK] '
labels: '🔄 fullstack'
assignees: ''
---

## 🎯 Description
Brief description of the full-stack feature

## 🏗️ Backend Requirements
- [ ] API endpoints
- [ ] Database changes
- [ ] Business logic

## 🎨 Frontend Requirements
- [ ] UI components
- [ ] State management
- [ ] API integration

## 🔄 Integration Points
- **API contracts**: 
- **Data flow**: 
- **Error handling**: 

## ✅ Acceptance Criteria
- [ ] Backend functionality works
- [ ] Frontend UI is implemented
- [ ] Integration is seamless
- [ ] Tests pass

## 🧪 Testing Strategy
- [ ] Backend unit tests
- [ ] Frontend unit tests
- [ ] Integration tests
- [ ] E2E tests
```

### 🔄 **Workflow Integration**

#### Automatic Label Assignment:
```yaml
# .github/workflows/auto-label.yml
name: Auto Label

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - name: 🏷️ Auto label based on files
        uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          configuration-path: .github/labeler.yml
```

#### Label Configuration:
```yaml
# .github/labeler.yml
'🏗️ backend':
  - kan-back/**/*

'🎨 frontend':
  - kan-front/**/*

'🔄 fullstack':
  - kan-back/**/*
  - kan-front/**/*

'🐳 devops':
  - .github/**/*
  - docker-compose*.yml
  - scripts/**/*

'📚 docs':
  - '**/*.md'
  - docs/**/*
```

### 📊 **Branch Strategy по компонентам**

#### Naming Convention:
```bash
# Backend features
feature/backend/auth-api
feature/backend/user-management
hotfix/backend/security-patch

# Frontend features  
feature/frontend/login-form
feature/frontend/dashboard-ui
hotfix/frontend/mobile-fix

# Full-stack features
feature/fullstack/user-profile
feature/fullstack/task-management

# Infrastructure
feature/devops/ci-pipeline
feature/devops/docker-optimization
```

### 🎯 **Pull Request Templates**

#### PR Template with Component Detection:
```markdown
<!-- .github/pull_request_template.md -->
## 🎯 Changes Summary

### 📋 Component Changes
- [ ] 🏗️ Backend (`kan-back/`)
- [ ] 🎨 Frontend (`kan-front/`)
- [ ] 🐳 DevOps (`.github/`, `docker-compose`, `scripts/`)
- [ ] 📚 Documentation

### 🔄 Type of Change
- [ ] ✨ New feature
- [ ] 🐛 Bug fix
- [ ] 🔧 Maintenance
- [ ] 📈 Enhancement
- [ ] 🔒 Security

### 🧪 Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

### 📊 Impact Assessment
- [ ] No breaking changes
- [ ] Database migration required
- [ ] Environment variables changed
- [ ] Dependencies updated

### 🔗 Related Issues
Closes #
Related to #

## 🎯 Component-Specific Details

### 🏗️ Backend Changes (if applicable)
- **API endpoints**: 
- **Database changes**: 
- **Breaking changes**: 

### 🎨 Frontend Changes (if applicable)
- **Components affected**: 
- **UI/UX changes**: 
- **Performance impact**: 

### 🧪 Testing Evidence
- [ ] Screenshots/GIFs for UI changes
- [ ] API testing evidence
- [ ] Performance benchmarks (if applicable)
```

### 📈 **GitHub Insights по компонентам**

#### Custom Queries:
```
# Backend-only PRs
is:pr label:"🏗️ backend" -label:"🎨 frontend"

# Frontend-only PRs  
is:pr label:"🎨 frontend" -label:"🏗️ backend"

# Full-stack PRs
is:pr label:"🏗️ backend" label:"🎨 frontend"

# Critical issues by component
is:issue label:"🔥 critical" label:"🏗️ backend"
is:issue label:"🔥 critical" label:"🎨 frontend"
```

### 🎯 **Milestones по компонентам**

#### Организация релизов:
```
v1.0.0 - Backend API Complete
├── User Authentication (Backend)
├── Task Management API (Backend)  
├── Agent Management API (Backend)
└── API Documentation (Backend)

v1.0.0 - Frontend MVP Complete
├── User Interface (Frontend)
├── Kanban Board (Frontend)
├── Agent Dashboard (Frontend)
└── Responsive Design (Frontend)

v1.0.0 - Integration Complete
├── API Integration (Full-stack)
├── E2E Testing (Full-stack)
├── Performance Optimization (Full-stack)
└── Deployment Pipeline (DevOps)
```

### 🚀 **Automated Project Management**

#### Auto-move cards based on CI status:
```yaml
# .github/workflows/project-automation.yml
name: Project Automation

on:
  pull_request:
    types: [opened, closed, converted_to_draft, ready_for_review]
  issues:
    types: [opened, closed, reopened]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: 🎯 Move to appropriate column
        uses: alex-page/github-project-automation-plus@v0.8.1
        with:
          project: AI Kanban Agent
          column: |
            ${{ github.event.pull_request.draft && 'Backend In Progress' || 
                contains(github.event.pull_request.labels.*.name, '🏗️ backend') && 'Backend In Progress' ||
                contains(github.event.pull_request.labels.*.name, '🎨 frontend') && 'Frontend In Progress' ||
                'Integration' }}
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```