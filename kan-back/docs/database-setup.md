# Database Integration Setup

## 🚀 Quick Start

### 1. Start Database Services

```bash
# Start PostgreSQL and Redis
yarn db:up

# Check if services are running
docker ps
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your database settings
# The default settings work with docker-compose.dev.yml
```

### 3. Start Application

```bash
# Install dependencies
yarn install

# Start in development mode
yarn start:dev
```

### 4. Verify Database Connection

The application will automatically create tables when started with `synchronize: true` in development.

## 📊 Database Management

### Available Scripts

```bash
# Database services
yarn db:up          # Start PostgreSQL and Redis
yarn db:down        # Stop all services
yarn db:reset       # Reset database (removes all data)
yarn db:logs        # View PostgreSQL logs

# Database admin
yarn adminer        # Start Adminer web interface
```

### Adminer Access

- URL: http://localhost:8080
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres
- Database: kanban_ai_agent

## 🎯 API Endpoints

### Agent Configuration

```bash
# Store/Update Agent Configuration
POST /database/agents/store-config
```

**Example Request:**

```json
{
  "name": "Task Analyzer Agent",
  "description": "Analyzes tasks and provides insights",
  "status": "active",
  "config": {
    "analysisDepth": "detailed",
    "autoAssign": true
  },
  "jiraInstanceUrl": "https://company.atlassian.net",
  "jiraProjectKey": "PROJ",
  "contextSources": {
    "includeComments": true,
    "includeHistory": true
  },
  "notificationSettings": {
    "email": true,
    "telegram": false
  },
  "instructions": [
    {
      "columnId": "COLUMN_TODO",
      "columnName": "To Do",
      "instruction": "Analyze task requirements and add estimates",
      "triggerEvent": "on_enter",
      "isActive": true,
      "priority": 1
    }
  ]
}
```

### Task History

```bash
# Store Task History
POST /database/task-history/store

# Get Task History by Agent
GET /database/task-history/agent/{agentId}?limit=50

# Get Task History by Task
GET /database/task-history/task/{taskId}

# Get Processing Statistics
GET /database/task-history/statistics?agentId={agentId}
```

## 🔧 Database Schema

### Entities

1. **Agent** - Main agent configuration
2. **AgentInstruction** - Column-specific instructions
3. **TaskHistory** - Task processing history
4. **NotificationLog** - Notification delivery logs

### Relationships

- Agent → AgentInstruction (1:N)
- Agent → TaskHistory (1:N)

## 🧪 Testing

```bash
# Run database integration tests
yarn test:integration database-management

# Run all tests
yarn test:all
```

## ⚠️ Environment Variables

Required database configuration in `.env`:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=kanban_ai_agent
DB_SSL=false

# Redis (for Bull Queue)
REDIS_URL=redis://localhost:6379
```

## 🔄 Development Workflow

1. Start database: `yarn db:up`
2. Start application: `yarn start:dev`
3. Make changes to entities
4. Restart application (auto-migration in dev)
5. Test with: `yarn test:integration`

## 📈 Production Considerations

- Set `synchronize: false` in production
- Use proper database migrations
- Configure SSL connections
- Set up database backups
- Monitor connection pools

## 🔍 Troubleshooting

### Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
yarn db:logs

# Reset everything
yarn db:reset
```

### Port Conflicts

If ports 5432 or 6379 are already in use, modify `docker-compose.dev.yml`:

```yaml
services:
  postgres:
    ports:
      - '5433:5432' # Change host port
  redis:
    ports:
      - '6380:6379' # Change host port
```

Update `.env` accordingly:

```bash
DB_PORT=5433
REDIS_URL=redis://localhost:6380
```
