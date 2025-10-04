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
2. **Isolation**: One endpoint = one file
3. **Yarn only**: Never use npm
4. **Clear structure**: Every file in its place
5. **Descriptive names**: Names should be self-explanatory
