# AI Agent Project Instructions

## 📦 Package Manager

**ALWAYS USE YARN, NEVER NPM!**

- Install packages: `yarn add package-name`
- Install dev dependencies: `yarn add -D package-name`
- Remove packages: `yarn remove package-name`
- Install all dependencies: `yarn install`

❌ **NEVER USE:**

- `npm install`
- `npm add`
- `npm run`

✅ **ALWAYS USE:**

- `yarn install`
- `yarn add`
- `yarn start`

## 🏗️ Project Architecture - Block Structure

### Core Principle: ONE BLOCK = ONE TASK

The project must be divided into separate blocks (folders), where each block is responsible for a specific task:

```
src/
├── ai-agent/           # Block for AI agent
├── jira-integration/   # Block for Jira integration
├── task-analytics/     # Block for task analytics
├── user-management/    # Block for user management
├── notifications/      # Block for notifications
└── ...                 # Other task-based blocks
```

### Each block must contain:

- Its own module
- Its own controllers
- Its own services
- Its own DTOs
- Its own interfaces
- Its own tests

## 🛠️ Endpoint Structure - One Endpoint = One Folder

### CRITICAL: EACH ENDPOINT IN A SEPARATE FOLDER!

**Create a separate folder with a complete set of files for each endpoint:**

```
src/ai-agent/
├── create-task/          # Endpoint POST /ai-agent/create-task
│   ├── create-task.controller.ts
│   ├── create-task.service.ts
│   ├── create-task.dto.ts
│   ├── create-task.module.ts
│   ├── create-task.interface.ts
│   └── create-task.spec.ts
├── get-task-status/      # Endpoint GET /ai-agent/task-status/:id
│   ├── get-task-status.controller.ts
│   ├── get-task-status.service.ts
│   ├── get-task-status.dto.ts
│   ├── get-task-status.module.ts
│   └── get-task-status.spec.ts
└── update-task/          # Endpoint PUT /ai-agent/update-task/:id
    ├── update-task.controller.ts
    ├── update-task.service.ts
    ├── update-task.dto.ts
    ├── update-task.module.ts
    └── update-task.spec.ts
```

### Example Jira Integration Block Structure:

```
src/jira-integration/
├── connect-jira/         # POST /jira/connect
│   ├── connect-jira.controller.ts
│   ├── connect-jira.service.ts
│   ├── connect-jira.dto.ts
│   ├── connect-jira.module.ts
│   └── connect-jira.spec.ts
├── get-jira-issues/      # GET /jira/issues
│   ├── get-jira-issues.controller.ts
│   ├── get-jira-issues.service.ts
│   ├── get-jira-issues.dto.ts
│   ├── get-jira-issues.module.ts
│   └── get-jira-issues.spec.ts
└── create-jira-issue/    # POST /jira/issues
    ├── create-jira-issue.controller.ts
    ├── create-jira-issue.service.ts
    ├── create-jira-issue.dto.ts
    ├── create-jira-issue.module.ts
    └── create-jira-issue.spec.ts
```

## 📝 Naming Rules

### Block Folders:

- Use kebab-case
- Name should reflect functionality
- Examples: `ai-agent`, `jira-integration`, `task-analytics`

### Endpoint Folders:

- Use kebab-case
- Name should precisely reflect the endpoint action
- Examples: `create-task`, `get-task-status`, `update-task`, `delete-task`

### Files:

- Use kebab-case
- Format: `[endpoint-name].[type].ts`
- Examples:
  - `create-task.controller.ts`
  - `get-task-status.service.ts`
  - `update-task.dto.ts`

## 🎯 Core Principles

1. **Modularity**: Each block is independent
2. **Isolation**: One endpoint = one folder
3. **Yarn only**: Never use npm
4. **Clear structure**: Every file in its place
5. **Descriptive names**: Names should be self-explanatory

## 🚀 Working Commands

```bash
# Start project
yarn start:dev

# Install dependencies
yarn install

# Add new dependency
yarn add @nestjs/some-package

# Testing
yarn test

# Build
yarn build
```
