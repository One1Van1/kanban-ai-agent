/**
 * User Entity
 *
 * Represents a user in the system with authentication and profile information.
 * Corresponds to backend User entity.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneNumber?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface UserPreferences {
  theme?: Theme;
  language?: string;
  notifications?: NotificationPreferences;
  dashboard?: DashboardPreferences;
  kanban?: KanbanPreferences;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface NotificationPreferences {
  email?: {
    enabled: boolean;
    frequency?: NotificationFrequency;
    types?: NotificationType[];
  };
  push?: {
    enabled: boolean;
    types?: NotificationType[];
  };
  inApp?: {
    enabled: boolean;
  };
}

export enum NotificationFrequency {
  REALTIME = 'realtime',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  TASK_COMMENTED = 'task_commented',
  TASK_DUE_SOON = 'task_due_soon',
  FLOW_COMPLETED = 'flow_completed',
  FLOW_FAILED = 'flow_failed',
  AGENT_EXECUTED = 'agent_executed',
  MENTION = 'mention',
}

export interface DashboardPreferences {
  widgets?: string[];
  layout?: Record<string, any>;
  defaultView?: string;
}

export interface KanbanPreferences {
  defaultBoard?: string;
  columnView?: ColumnView;
  sortBy?: TaskSortField;
  sortOrder?: SortOrder;
  filters?: TaskFilters;
  cardDisplay?: CardDisplayOptions;
}

export enum ColumnView {
  COMPACT = 'compact',
  COMFORTABLE = 'comfortable',
  SPACIOUS = 'spacious',
}

export enum TaskSortField {
  PRIORITY = 'priority',
  DUE_DATE = 'dueDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface TaskFilters {
  assignees?: string[];
  priorities?: string[];
  tags?: string[];
  dueDate?: DateFilter;
}

export interface DateFilter {
  from?: Date;
  to?: Date;
  preset?: DatePreset;
}

export enum DatePreset {
  TODAY = 'today',
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  OVERDUE = 'overdue',
}

export interface CardDisplayOptions {
  showAvatar?: boolean;
  showPriority?: boolean;
  showTags?: boolean;
  showDueDate?: boolean;
  showEstimate?: boolean;
  showSubtaskCount?: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: UserActivityAction;
  resourceType?: string;
  resourceId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum UserActivityAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  EXPORT = 'export',
}
