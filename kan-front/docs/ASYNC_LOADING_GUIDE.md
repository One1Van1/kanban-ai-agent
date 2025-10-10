# 🔄 Async Loading Patterns Guide

## Overview

Comprehensive guide for implementing efficient async data loading in our Next.js application with proper loading states, error handling, and user experience.

## 🎯 Core Principles

1. **Always show loading states**
2. **Handle errors gracefully**
3. **Implement optimistic updates**
4. **Use React Query for caching**
5. **Debounce user inputs**

## 📋 Table Loading Pattern

### Basic Implementation

```typescript
// components/tables/AsyncTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api/client';

interface AsyncTableProps<T> {
  queryKey: string[];
  fetchFn: () => Promise<T[]>;
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
  emptyMessage?: string;
}

export function AsyncTable<T>({
  queryKey,
  fetchFn,
  columns,
  emptyMessage = "No data available"
}: AsyncTableProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load data.
          <button
            onClick={() => refetch()}
            className="underline ml-2"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data?.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Usage Example

```typescript
// app/agents/page.tsx
import { AsyncTable } from '@/components/tables/AsyncTable';
import { apiClient } from '@/lib/api/client';

export default function AgentsPage() {
  return (
    <AsyncTable
      queryKey={['agents']}
      fetchFn={apiClient.agents.list}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        {
          key: 'isActive',
          label: 'Status',
          render: (value) => (
            <Badge variant={value ? 'default' : 'secondary'}>
              {value ? 'Active' : 'Inactive'}
            </Badge>
          )
        },
      ]}
    />
  );
}
```

## 🔄 Infinite Scroll Pattern

```typescript
// hooks/useInfiniteQuery.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteTasksQuery(columnId: string) {
  return useInfiniteQuery({
    queryKey: ['tasks', 'infinite', columnId],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.kanban.tasks.getByColumn(columnId, {
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNext ? pages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

## 🎨 Loading Components

### Skeleton Loader

```typescript
// components/skeletons/TaskCardSkeleton.tsx
export function TaskCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
```

### Loading Spinner

```typescript
// components/ui/loading-spinner.tsx
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", className)} />
  );
}
```

## 🚨 Error Handling

### Error Boundary

```typescript
// components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🎯 Best Practices

1. **Use React Query** for all server state
2. **Implement proper loading states** for better UX
3. **Handle errors gracefully** with retry mechanisms
4. **Use optimistic updates** for immediate feedback
5. **Implement proper caching** strategies
6. **Show skeleton loaders** instead of spinners when possible

## 📱 Responsive Loading

```typescript
// components/responsive-loader.tsx
export function ResponsiveLoader() {
  return (
    <div className="space-y-4">
      {/* Desktop */}
      <div className="hidden md:block">
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
```

This pattern ensures consistent loading behavior across our application while maintaining good performance and user experience.
