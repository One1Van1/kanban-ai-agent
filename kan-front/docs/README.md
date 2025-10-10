# 📚 Frontend Development Guide

## Overview

Comprehensive guide for all frontend development patterns, best practices, and workflows for our AI Kanban Agent application.

## 📖 Quick Navigation

- [🔄 Async Loading Patterns](./ASYNC_LOADING_GUIDE.md) - Complete guide for efficient data loading
- [🧩 Component Architecture](./COMPONENT_ARCHITECTURE.md) - Structured component development
- [🎨 Design System](./DESIGN_SYSTEM.md) - UI/UX consistency and design tokens
- [🧪 Testing Strategy](./TESTING_STRATEGY.md) - Comprehensive testing approach
- [🚀 Development Workflow](./DEVELOPMENT_WORKFLOW.md) - Efficient development processes

## 🎯 Key Development Principles

### 1. **Component-First Architecture**

- Each feature is built as reusable components
- Proper TypeScript interfaces for all props
- Consistent file structure across components
- Clear separation of concerns

### 2. **State Management Strategy**

- **Zustand** for client state management
- **TanStack Query** for server state and caching
- Optimistic updates for better UX
- Proper error handling and loading states

### 3. **Performance Optimization**

- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Proper caching strategies
- Bundle analysis and optimization

### 4. **Type Safety**

- TypeScript everywhere
- Strict type checking enabled
- Proper interface definitions
- Type-safe API client

## 🛠️ Quick Start Commands

```bash
# Start development environment
yarn dev

# Run tests
yarn test
yarn test:e2e

# Type checking
yarn type-check

# Linting
yarn lint --fix

# Build for production
yarn build
```

## 📁 Project Structure

```
kan-front/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components (Shadcn)
│   │   ├── forms/        # Form components
│   │   ├── charts/       # Data visualization
│   │   ├── agents/       # AI Agent components
│   │   ├── kanban/       # Kanban board components
│   │   ├── layout/       # Layout components
│   │   └── shared/       # Shared utilities
│   ├── lib/              # Utilities and configurations
│   │   ├── api/          # API client
│   │   ├── stores/       # State management
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Helper functions
│   └── styles/           # Styling utilities
├── docs/                 # Development documentation
├── e2e/                  # E2E tests
└── public/              # Static assets
```

## 🎨 Styling Approach

### Tailwind CSS + Shadcn/ui

- **Utility-first CSS** with Tailwind
- **Component library** with Shadcn/ui
- **Design tokens** for consistency
- **Dark mode** support built-in

### Example Component Styling

```typescript
// Good: Using design tokens and variants
<Button
  variant="agent"
  size="sm"
  className="hover:bg-agent-active transition-colors"
>
  Start Agent
</Button>

// Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
</div>
```

## 🔄 Data Flow Patterns

### 1. Server State with TanStack Query

```typescript
// hooks/use-agents.ts
export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: apiClient.agents.list,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// components/agents/agents-list.tsx
export function AgentsList() {
  const { data: agents, isLoading, error } = useAgents();

  if (isLoading) return <AgentsListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents?.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
```

### 2. Client State with Zustand

```typescript
// stores/ui-store.ts
interface UIState {
  sidebar: {
    isOpen: boolean;
    activeSection: string;
  };
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebar: {
    isOpen: true,
    activeSection: 'dashboard',
  },
  theme: 'system',
  toggleSidebar: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen },
    })),
  setTheme: (theme) => set({ theme }),
}));
```

## 🧪 Testing Best Practices

### Component Testing Example

```typescript
// components/agents/agent-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from './agent-card';
import { mockAgent } from '@/mocks/data';

describe('AgentCard', () => {
  it('renders agent information correctly', () => {
    render(<AgentCard agent={mockAgent} onToggle={jest.fn()} />);

    expect(screen.getByText(mockAgent.name)).toBeInTheDocument();
    expect(screen.getByText(mockAgent.description)).toBeInTheDocument();
  });

  it('calls onToggle when button is clicked', () => {
    const onToggle = jest.fn();
    render(<AgentCard agent={mockAgent} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onToggle).toHaveBeenCalledWith(mockAgent.id);
  });
});
```

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const AnalyticsChart = dynamic(() => import('@/components/charts/analytics-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

// Lazy load modals
const TaskModal = dynamic(() => import('@/components/kanban/task-modal'), {
  loading: () => <ModalSkeleton />,
});
```

### Image Optimization

```typescript
// Optimized images with Next.js
import Image from 'next/image';

<Image
  src="/agent-avatar.png"
  alt="Agent Avatar"
  width={48}
  height={48}
  className="rounded-full"
  priority // For above-the-fold images
/>
```

## 🔧 Development Tools

### VSCode Extensions

- **TypeScript** - ms-vscode.vscode-typescript-next
- **Tailwind CSS** - bradlc.vscode-tailwindcss
- **Prettier** - esbenp.prettier-vscode
- **ESLint** - dbaeumer.vscode-eslint
- **Jest** - orta.vscode-jest
- **Playwright** - ms-playwright.playwright

### Browser DevTools

- **React DevTools** - Component inspection
- **TanStack Query DevTools** - Server state debugging
- **Lighthouse** - Performance auditing

## 📊 Bundle Analysis

```bash
# Analyze bundle size
yarn analyze

# Check for duplicate dependencies
yarn why package-name

# Security audit
yarn audit
```

## 🎯 Code Quality Checklist

### Before Committing

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Components are properly typed
- [ ] Accessibility attributes included
- [ ] Responsive design tested
- [ ] Performance impact considered

### Code Review Checklist

- [ ] Component follows single responsibility principle
- [ ] Proper error handling implemented
- [ ] Loading states provided
- [ ] Accessibility compliance
- [ ] Mobile responsiveness
- [ ] Type safety maintained
- [ ] Test coverage adequate

## 🚀 Deployment Considerations

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
```

### Build Optimization

```javascript
// next.config.js
const nextConfig = {
  // Bundle analyzer
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },

  // Image optimization
  images: {
    domains: ['localhost', 'api.kanban-agent.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};
```

## 🎨 UI/UX Guidelines

### Responsive Design Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Color Usage

- **Primary**: Main actions, links
- **Success**: Agent active, task completion
- **Warning**: Pending actions, attention needed
- **Error**: Failures, critical issues
- **Gray**: Secondary text, borders, backgrounds

### Typography Scale

- **Headings**: 2xl, xl, lg
- **Body**: base, sm
- **Captions**: xs

## 🔄 Update Process

### Dependencies

```bash
# Check outdated packages
yarn outdated

# Update dependencies
yarn upgrade-interactive

# Update Next.js
yarn add next@latest react@latest react-dom@latest
```

### Documentation

- Keep guides updated with new patterns
- Document breaking changes
- Update examples with latest APIs
- Review and update quarterly

This guide serves as the single source of truth for frontend development in our AI Kanban Agent project. Keep it updated as patterns evolve!
