# 🎨 Design System Guide

## Overview

Complete design system for consistent UI/UX across our AI Kanban Agent application.

## 🎯 Design Tokens

### Colors

```typescript
// styles/design-tokens.ts
export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },

  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // AI Agent specific colors
  agent: {
    active: '#10b981',
    inactive: '#6b7280',
    processing: '#f59e0b',
    error: '#ef4444',
  },

  // Kanban board colors
  kanban: {
    todo: '#e5e7eb',
    inProgress: '#3b82f6',
    review: '#f59e0b',
    done: '#10b981',
  },
};
```

### Typography

```typescript
// styles/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  },

  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing

```typescript
// styles/spacing.ts
export const spacing = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
};
```

## 🧩 Component Variants

### Button Variants

```typescript
// components/ui/button.tsx (Enhanced)
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        // AI Agent specific variants
        agent: 'bg-green-500 text-white hover:bg-green-600',
        'agent-inactive': 'bg-gray-400 text-white hover:bg-gray-500',
        'agent-processing': 'bg-yellow-500 text-white hover:bg-yellow-600',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
```

### Card Variants

```typescript
// components/ui/card.tsx (Enhanced)
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'shadow-md hover:shadow-lg transition-shadow',
        outlined: 'border-2',
        // Kanban specific variants
        task: 'hover:shadow-md transition-shadow cursor-pointer',
        column: 'bg-gray-50 border-gray-200',
        // Agent specific variants
        agent: 'border-green-200 bg-green-50',
        'agent-inactive': 'border-gray-200 bg-gray-50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  },
);
```

## 🎭 Component Library

### Status Badge

```typescript
// components/ui/status-badge.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'processing' | 'error' | 'pending';
  children: React.ReactNode;
  className?: string;
}

const statusVariants = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  pending: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(statusVariants[status], className)}
      variant="outline"
    >
      {children}
    </Badge>
  );
}
```

### Priority Badge

```typescript
// components/ui/priority-badge.tsx
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
  showIcon?: boolean;
}

const priorityConfig = {
  critical: {
    color: 'bg-red-500 text-white',
    icon: AlertTriangle,
  },
  high: {
    color: 'bg-orange-500 text-white',
    icon: ArrowUp,
  },
  medium: {
    color: 'bg-yellow-500 text-white',
    icon: Minus,
  },
  low: {
    color: 'bg-green-500 text-white',
    icon: ArrowDown,
  },
};

export function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge className={config.color}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
```

### Avatar with Fallback

```typescript
// components/ui/user-avatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeVariants = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function UserAvatar({ src, name, size = 'md', className }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeVariants[size], className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
```

## 🎨 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        agent: {
          active: '#10b981',
          inactive: '#6b7280',
          processing: '#f59e0b',
          error: '#ef4444',
        },
        kanban: {
          todo: '#e5e7eb',
          'in-progress': '#3b82f6',
          review: '#f59e0b',
          done: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

## 🎭 Component Themes

### Dark Mode Support

```typescript
// components/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

const ThemeProviderContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
```

## 📐 Layout Grid System

```css
/* styles/grid.css */
.grid-container {
  display: grid;
  gap: 1rem;
}

/* Responsive grid layouts */
.grid-dashboard {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-kanban {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.grid-agents {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.grid-analytics {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2rem;
}

@media (max-width: 768px) {
  .grid-analytics {
    grid-template-columns: 1fr;
  }
}
```

## 🎨 Best Practices

1. **Consistent Spacing** - Use design tokens for all spacing
2. **Color Accessibility** - Ensure proper contrast ratios
3. **Responsive Design** - Mobile-first approach
4. **Performance** - Optimize for fast loading
5. **Semantic HTML** - Use proper HTML5 elements
6. **TypeScript** - Type all component props
7. **Testing** - Include visual regression tests
8. **Documentation** - Document all design decisions

This design system ensures visual consistency and developer productivity across our entire application.
