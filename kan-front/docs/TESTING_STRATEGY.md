# 🧪 Testing Strategy Guide

## Overview

Comprehensive testing approach for our AI Kanban Agent application using Jest, React Testing Library, and Playwright.

## 🎯 Testing Pyramid

```
E2E Tests (Playwright)     [10%]
├── User workflows
├── Critical paths
└── Cross-browser testing

Integration Tests (Jest)   [20%]
├── API integration
├── Store integration
└── Component integration

Unit Tests (Jest + RTL)    [70%]
├── Components
├── Utilities
├── Hooks
└── Stores
```

## 🛠️ Test Setup

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Test Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Start mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🧪 Unit Testing

### Component Testing

```typescript
// components/kanban/task-card/task-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './index';
import { mockTask } from '@/mocks/data';

describe('TaskCard', () => {
  const defaultProps = {
    task: mockTask,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText(mockTask.assignee)).toBeInTheDocument();
  });

  it('handles drag and drop correctly', () => {
    render(<TaskCard {...defaultProps} />);

    const card = screen.getByRole('article');

    fireEvent.dragStart(card, {
      dataTransfer: {
        setData: jest.fn(),
      },
    });

    expect(card).toHaveAttribute('draggable', 'true');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard {...defaultProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask.id);
  });

  it('applies correct styling when dragging', () => {
    render(<TaskCard {...defaultProps} isDragging={true} />);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('opacity-50', 'rotate-2');
  });
});
```

### Hook Testing

```typescript
// hooks/use-kanban-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useKanbanStore } from '@/lib/stores/kanban-store';
import { mockTask, mockColumn } from '@/mocks/data';

describe('useKanbanStore', () => {
  beforeEach(() => {
    // Reset store state
    useKanbanStore.getState().reset();
  });

  it('adds task correctly', () => {
    const { result } = renderHook(() => useKanbanStore());

    act(() => {
      result.current.addTask(mockTask);
    });

    expect(result.current.tasks).toContain(mockTask);
  });

  it('moves task between columns', () => {
    const { result } = renderHook(() => useKanbanStore());

    act(() => {
      result.current.addTask(mockTask);
      result.current.moveTask(mockTask.id, 'in-progress');
    });

    const updatedTask = result.current.tasks.find((t) => t.id === mockTask.id);
    expect(updatedTask?.columnId).toBe('in-progress');
  });

  it('handles loading states correctly', () => {
    const { result } = renderHook(() => useKanbanStore());

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });
});
```

### Utility Testing

```typescript
// lib/utils/date.test.ts
import { formatDate, isOverdue, getDaysUntilDue } from './date';

describe('Date utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('Jan 15, 2024');
    });

    it('handles invalid date', () => {
      expect(formatDate(null)).toBe('No date');
    });
  });

  describe('isOverdue', () => {
    it('returns true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
      const futureDate = new Date('2030-01-01');
      expect(isOverdue(futureDate)).toBe(false);
    });
  });

  describe('getDaysUntilDue', () => {
    it('calculates days correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(getDaysUntilDue(tomorrow)).toBe(1);
    });
  });
});
```

## 🔗 Integration Testing

### API Integration

```typescript
// lib/api/client.test.ts
import { apiClient } from './client';
import { server } from '@/mocks/server';
import { rest } from 'msw';

describe('API Client', () => {
  describe('Agents API', () => {
    it('fetches agents successfully', async () => {
      const agents = await apiClient.agents.list();

      expect(agents).toHaveLength(2);
      expect(agents[0]).toHaveProperty('id');
      expect(agents[0]).toHaveProperty('name');
    });

    it('handles API errors gracefully', async () => {
      server.use(
        rest.get('/api/agents', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        }),
      );

      await expect(apiClient.agents.list()).rejects.toThrow('Server error');
    });

    it('creates agent with correct data', async () => {
      const newAgent = {
        name: 'Test Agent',
        role: 'TASK_MANAGER',
        description: 'Test description',
      };

      const createdAgent = await apiClient.agents.create(newAgent);

      expect(createdAgent).toMatchObject(newAgent);
      expect(createdAgent).toHaveProperty('id');
    });
  });

  describe('Kanban API', () => {
    it('moves task between columns', async () => {
      const taskId = '1';
      const newColumnId = 'in-progress';

      const updatedTask = await apiClient.kanban.tasks.move(
        taskId,
        newColumnId,
      );

      expect(updatedTask.columnId).toBe(newColumnId);
    });
  });
});
```

### Store Integration

```typescript
// stores/integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AgentsList } from '@/components/agents/agents-list';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('Store Integration', () => {
  it('loads and displays agents from API', async () => {
    renderWithProviders(<AgentsList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Agent 1')).toBeInTheDocument();
      expect(screen.getByText('Test Agent 2')).toBeInTheDocument();
    });
  });

  it('handles error states correctly', async () => {
    server.use(
      rest.get('/api/agents', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderWithProviders(<AgentsList />);

    await waitFor(() => {
      expect(screen.getByText(/error loading agents/i)).toBeInTheDocument();
    });
  });
});
```

## 🎭 E2E Testing with Playwright

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'yarn start:front',
    port: 3001,
  },
});
```

### E2E Test Examples

```typescript
// e2e/kanban-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Kanban Board Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban');
  });

  test('creates and moves task through workflow', async ({ page }) => {
    // Create new task
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title"]', 'Test Task');
    await page.fill('[data-testid="task-description"]', 'Test Description');
    await page.click('[data-testid="save-task"]');

    // Verify task appears in Todo column
    await expect(page.locator('[data-testid="todo-column"]')).toContainText(
      'Test Task',
    );

    // Drag task to In Progress
    await page.dragAndDrop(
      '[data-testid="task-Test Task"]',
      '[data-testid="in-progress-column"]',
    );

    // Verify task moved
    await expect(
      page.locator('[data-testid="in-progress-column"]'),
    ).toContainText('Test Task');
  });

  test('filters tasks by assignee', async ({ page }) => {
    await page.selectOption('[data-testid="assignee-filter"]', 'john-doe');

    await expect(page.locator('[data-testid="task-card"]')).toHaveCount(2);
    await expect(
      page.locator('[data-testid="task-card"]').first(),
    ).toContainText('John Doe');
  });
});
```

```typescript
// e2e/agent-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Management', () => {
  test('activates and deactivates agents', async ({ page }) => {
    await page.goto('/agents');

    // Find inactive agent
    const agentCard = page.locator('[data-testid="agent-card"]').first();
    await expect(
      agentCard.locator('[data-testid="status-badge"]'),
    ).toContainText('Inactive');

    // Activate agent
    await agentCard.locator('[data-testid="toggle-agent"]').click();

    // Verify status changed
    await expect(
      agentCard.locator('[data-testid="status-badge"]'),
    ).toContainText('Active');

    // Verify success notification
    await expect(page.locator('[data-testid="notification"]')).toContainText(
      'Agent activated',
    );
  });

  test('creates new agent', async ({ page }) => {
    await page.goto('/agents');

    await page.click('[data-testid="create-agent-button"]');
    await page.fill('[data-testid="agent-name"]', 'New Test Agent');
    await page.selectOption('[data-testid="agent-role"]', 'TASK_MANAGER');
    await page.fill(
      '[data-testid="agent-description"]',
      'Test agent description',
    );
    await page.click('[data-testid="save-agent"]');

    // Verify agent appears in list
    await expect(page.locator('[data-testid="agent-card"]')).toContainText(
      'New Test Agent',
    );
  });
});
```

## 🎯 Visual Testing

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('dashboard layout looks correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('kanban board layout is consistent', async ({ page }) => {
    await page.goto('/kanban');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('kanban-board.png');
  });

  test('dark mode renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="theme-toggle"]');
    await expect(page).toHaveScreenshot('dashboard-dark.png');
  });
});
```

## 🏗️ Test Scripts

```json
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "yarn test && yarn test:e2e"
  }
}
```

## 🎯 Best Practices

1. **Test Behavior, Not Implementation** - Focus on user interactions
2. **Use Data Test IDs** - Avoid coupling to CSS classes
3. **Mock External Dependencies** - Keep tests isolated
4. **Test Edge Cases** - Error states, empty states, loading states
5. **Maintain Test Data** - Keep mock data consistent
6. **Continuous Testing** - Run tests in CI/CD pipeline
7. **Visual Regression** - Catch UI changes automatically
8. **Performance Testing** - Include performance assertions

This testing strategy ensures our application is reliable, maintainable, and user-friendly across all scenarios.
