# AI Kanban Agent 🤖

[![Backend CI/CD](https://github.com/One1Van1/kanban-ai-agent/actions/workflows/backend.yml/badge.svg)](https://github.com/One1Van1/kanban-ai-agent/actions/workflows/backend.yml)
[![Frontend CI/CD](https://github.com/One1Van1/kanban-ai-agent/actions/workflows/frontend.yml/badge.svg)](https://github.com/One1Van1/kanban-ai-agent/actions/workflows/frontend.yml)
[![Monorepo CI/CD](https://github.com/One1Van1/kanban-ai-agent/actions/workflows/monorepo.yml/badge.svg)](https://github.com/One1Van1/kanban-ai-agent/actions/workflows/monorepo.yml)
[![codecov](https://codecov.io/gh/One1Van1/kanban-ai-agent/branch/main/graph/badge.svg)](https://codecov.io/gh/One1Van1/kanban-ai-agent)

Intelligent AI-powered Kanban management system with automated workflow optimization and smart task handling.

## 🏗️ Monorepo Structure

This project is organized as a monorepo with separate CI/CD pipelines for backend and frontend:

```
kanban-ai-agent/
├── kan-back/          # 🏗️ NestJS Backend API
├── kan-front/         # 🎨 Next.js Frontend App
├── .github/           # 🔄 CI/CD Workflows
├── scripts/           # 🛠️ Development Scripts
└── docs/              # 📚 Documentation
```

## ⚡ Quick Start

### 🚀 Full Development Environment

```bash
# Clone repository
git clone https://github.com/One1Van1/kanban-ai-agent.git
cd kanban-ai-agent

# Setup development environment
yarn setup

# Start both frontend and backend
yarn dev
```

### 🏗️ Backend Only

```bash
# Start backend development server
yarn start:back

# Backend will run on http://localhost:3000
```

### 🎨 Frontend Only

```bash
# Start frontend development server
yarn start:front

# Frontend will run on http://localhost:3001
```

## 🔄 Separate CI/CD Pipelines

### 🏗️ Backend Pipeline (`.github/workflows/backend.yml`)

Triggers when changes are made to `kan-back/` directory:

- ✅ **Code Quality**: TypeScript checking, ESLint, Prettier
- 🧪 **Unit Tests**: Jest with PostgreSQL and Redis services
- 🔒 **Security**: Dependency audit and license checking
- 🚀 **Build**: Docker image creation and artifact upload
- 📊 **Coverage**: Codecov integration

### 🎨 Frontend Pipeline (`.github/workflows/frontend.yml`)

Triggers when changes are made to `kan-front/` directory:

- ✅ **Code Quality**: TypeScript checking, ESLint, Prettier
- 🧪 **Unit Tests**: Jest + React Testing Library
- 🎭 **E2E Tests**: Playwright cross-browser testing
- 📊 **Performance**: Lighthouse CI audits
- 🔒 **Security**: Bundle analysis and dependency audit
- 🚀 **Deploy**: Vercel deployment (optional)

### 🔄 Monorepo Pipeline (`.github/workflows/monorepo.yml`)

Orchestrates the entire workflow:

- 🔍 **Change Detection**: Smart path-based triggering
- 🏗️ **Parallel Execution**: Independent backend/frontend builds
- 🧪 **Integration Tests**: Full-stack testing
- 📊 **Quality Reports**: Comprehensive status reporting
- 🚀 **Coordinated Deployment**: Production releases

## 📊 Benefits of This Setup

### 🎯 **Independent Development**

- Backend and frontend teams can work independently
- Separate deployment cycles and release schedules
- Isolated dependency management

### ⚡ **Optimized CI/CD**

- Only affected components are tested and built
- Faster feedback loops
- Reduced resource usage

### 🔄 **Coordinated Integration**

- Full integration testing before production
- Unified quality gates
- Consistent versioning and releases

### 📈 **Scalability**

- Easy to add new services or components
- Clear separation of concerns
- Maintainable as project grows

### 2. Start Development Environment

```bash
# Start everything (databases + backend + frontend)
./scripts/start-dev.sh

# OR start individually:
yarn start:back    # Backend only (http://localhost:3000)
yarn start:front   # Frontend only (http://localhost:3001)
```

### 3. Access Applications

- 🎨 **Frontend**: http://localhost:3001
- 🚀 **Backend API**: http://localhost:3000
- 📚 **API Documentation**: http://localhost:3000/api
- 🗄️ **Database Admin**: http://localhost:8080

## 📦 Available Scripts

### Root Level Commands

```bash
# Development
yarn start:dev          # Start both backend and frontend
yarn start:back          # Start backend only
yarn start:front         # Start frontend only

# Build
yarn build              # Build both projects
yarn build:back         # Build backend only
yarn build:front        # Build frontend only

# Testing
yarn test               # Run backend tests
yarn test:all           # Run all backend tests (unit + integration + e2e)

# Database Management
yarn db:up              # Start databases (PostgreSQL + Redis)
yarn db:down            # Stop databases
yarn db:reset           # Reset databases
yarn adminer            # Start database admin interface

# Utilities
yarn setup              # Install all dependencies
yarn clean:ports        # Clean up used ports
./scripts/clean-ports.sh # Clean ports script
./scripts/stop-dev.sh    # Stop all development services
```

## 🔧 Development Workflow

### Backend Development (kan-back/)

```bash
cd kan-back
yarn start:dev          # Start with hot reload
yarn test:watch         # Run tests in watch mode
yarn lint               # Lint code
```

### Frontend Development (kan-front/)

```bash
cd kan-front
yarn dev                # Start development server
yarn build              # Build for production
yarn lint               # Lint code
```

## 🌟 Key Features

### 🤖 AI Agents

- Create intelligent agents with custom instructions
- Automate kanban workflow based on column changes
- Integration with Claude AI for intelligent decision making
- Real-time activity monitoring

### 📋 Kanban Management

- Complete kanban board functionality with 38 API endpoints
- Drag & drop task management
- Real-time updates via WebSocket
- Advanced task tracking and analytics

### 🔗 Integrations

- **Jira API**: Sync with Atlassian Jira
- **Email Notifications**: SMTP integration
- **Telegram Bot**: Direct messaging capabilities
- **Database**: PostgreSQL with TypeORM

## 🏛️ Architecture

### Backend (kan-back/)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT-based
- **API Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **Task Queue**: Bull Queue with Redis

### Frontend (kan-front/)

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Real-time**: Socket.io client
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit

## 🔧 Configuration

### Environment Variables

**Backend (.env in kan-back/)**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/kanban_ai_agent
REDIS_URL=redis://localhost:6379
CLAUDE_API_KEY=your_claude_api_key
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your@email.com
JIRA_API_TOKEN=your_jira_token
```

**Frontend (.env.local in kan-front/)**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## 🧪 Testing

```bash
# Backend tests
cd kan-back
yarn test              # Unit tests
yarn test:integration  # Integration tests
yarn test:e2e          # End-to-end tests
yarn test:all          # All tests

# Frontend tests (when implemented)
cd kan-front
yarn test
```

## 🐳 Docker Support

```bash
# Start databases only
yarn db:up

# Full docker-compose setup (future)
docker-compose up -d
```

## 📈 API Endpoints

The backend provides 38+ REST API endpoints for complete kanban management:

- **Tasks**: CRUD operations, assignments, status changes
- **Boards**: Structure management, analytics
- **Comments**: Full comment lifecycle with reactions
- **AI Agents**: Creation, configuration, execution
- **Analytics**: Performance metrics and reporting

See `http://localhost:3000/api` for full API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the UNLICENSED License.

## 🔮 Roadmap

- [ ] Advanced AI agent templates
- [ ] Multi-board management
- [ ] Team collaboration features
- [ ] Mobile responsive design
- [ ] Advanced analytics dashboard
- [ ] Plugin system for custom integrations

---

**Made with ❤️ using NestJS, Next.js, and AI magic** ✨
