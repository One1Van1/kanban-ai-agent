# 🧩 Component Architecture Guide

## Overview

Structured approach to building scalable and maintainable React components in our Next.js application.

## 📁 Component Structure

```
kan-front/src/components/
├── ui/                     # Shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── table.tsx
│   └── ...
├── forms/                  # Form components
│   ├── task-form/
│   ├── agent-form/
│   └── auth-form/
├── charts/                 # Data visualization
│   ├── analytics-chart/
│   ├── progress-chart/
│   └── metrics-dashboard/
├── agents/                 # AI Agent components
│   ├── agent-card/
│   ├── agent-chat/
│   └── agent-settings/
├── kanban/                 # Kanban board components
│   ├── board/
│   ├── column/
│   ├── task-card/
│   └── task-modal/
├── layout/                 # Layout components
│   ├── header/
│   ├── sidebar/
│   └── footer/
└── shared/                 # Reusable components
    ├── data-table/
    ├── search-input/
    └── confirmation-modal/
```

## 🏗️ Component Structure Pattern

Each component folder should follow this structure:

```
component-name/
├── index.tsx              # Main component
├── component-name.types.ts # TypeScript interfaces
├── component-name.styles.ts # Styled components (if needed)
├── component-name.test.tsx # Unit tests
├── component-name.stories.tsx # Storybook stories (optional)
└── hooks/                 # Component-specific hooks
    └── use-component-name.ts
```

## 📝 Component Template

### Basic Component Template

```typescript
// components/shared/search-input/index.tsx
'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchInputProps } from './search-input.types';
import { useDebounce } from './hooks/use-debounce';

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  className,
  debounceMs = 300,
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value, debounceMs);

  const handleSearch = useCallback(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-10"
          {...props}
        />
      </div>
      <Button onClick={handleSearch} variant="outline" size="sm">
        Search
      </Button>
    </div>
  );
}

export default SearchInput;
```

### Component Types

```typescript
// components/shared/search-input/search-input.types.ts
import { InputHTMLAttributes } from 'react';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  debounceMs?: number;
}
```

### Component Hook

```typescript
// components/shared/search-input/hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## 🎯 Kanban Components

### Task Card Component

```typescript
// components/kanban/task-card/index.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCardProps } from './task-card.types';

export function TaskCard({
  task,
  onEdit,
  onDelete,
  className,
  isDragging = false
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        isDragging && "opacity-50 rotate-2",
        className
      )}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm leading-tight">
            {task.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.priority && (
              <Badge
                variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {task.priority}
              </Badge>
            )}
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {task.assignee}
                </span>
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🤖 Agent Components

### Agent Card Component

```typescript
// components/agents/agent-card/index.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Settings, Play, Pause } from 'lucide-react';
import { AgentCardProps } from './agent-card.types';

export function AgentCard({
  agent,
  onToggle,
  onSettings,
  onChat
}: AgentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-sm">{agent.name}</CardTitle>
          </div>
          <Badge variant={agent.isActive ? 'default' : 'secondary'}>
            {agent.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {agent.description}
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={agent.isActive ? "destructive" : "default"}
            onClick={() => onToggle(agent.id)}
          >
            {agent.isActive ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Start
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onSettings(agent.id)}
          >
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onChat(agent.id)}
          >
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 📊 Chart Components

### Analytics Chart Component

```typescript
// components/charts/analytics-chart/index.tsx
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AnalyticsChartProps } from './analytics-chart.types';

export function AnalyticsChart({
  data,
  title,
  dataKey,
  color = '#8884d8'
}: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      name: new Date(item.date).toLocaleDateString(),
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## 🧪 Testing Components

```typescript
// components/shared/search-input/search-input.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchInput } from './index';

describe('SearchInput', () => {
  it('calls onSearch when search button is clicked', async () => {
    const mockOnSearch = jest.fn();

    render(
      <SearchInput onSearch={mockOnSearch} placeholder="Test search" />
    );

    const input = screen.getByPlaceholderText('Test search');
    const searchButton = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });
  });

  it('debounces input changes', async () => {
    const mockOnSearch = jest.fn();

    render(<SearchInput onSearch={mockOnSearch} debounceMs={100} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: 'test query' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    }, { timeout: 200 });
  });
});
```

## 🎨 Best Practices

1. **Single Responsibility** - Each component has one clear purpose
2. **TypeScript First** - Always define proper interfaces
3. **Accessibility** - Include ARIA labels and semantic HTML
4. **Performance** - Use React.memo for expensive components
5. **Testing** - Write unit tests for complex logic
6. **Storybook** - Document components with stories
7. **Consistent Naming** - Use clear, descriptive names
8. **Composition** - Prefer composition over inheritance

This architecture ensures our components are maintainable, testable, and scalable as the application grows.
