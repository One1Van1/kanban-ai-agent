/**
 * Task Entity
 *
 * Represents a task in the Kanban board system.
 * Corresponds to backend Task entity.
 */

import { User } from '../user/user.entity';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  assigneeId?: string;
  reporter?: User;
  reporterId?: string;
  boardId: string;
  columnId: string;
  order: number;
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number; // in hours
  actualTime?: number; // in hours
  tags?: string[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  subtasks?: Task[];
  parentTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  jiraIssueKey?: string; // Jira integration
  customFields?: Record<string, any>;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  author: User;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  mentions?: string[];
  attachments?: TaskAttachment[];
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  columns: BoardColumn[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  isDefault?: boolean;
  settings?: BoardSettings;
}

export interface BoardColumn {
  id: string;
  name: string;
  order: number;
  taskStatus: TaskStatus;
  wipLimit?: number; // Work In Progress limit
  color?: string;
}

export interface BoardSettings {
  allowAddColumn?: boolean;
  allowDeleteColumn?: boolean;
  showSubtasks?: boolean;
  showEstimates?: boolean;
  defaultAssignee?: string;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  action: TaskActivityAction;
  field?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  description?: string;
}

export enum TaskActivityAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  COMMENTED = 'commented',
  ASSIGNED = 'assigned',
  STATUS_CHANGED = 'status_changed',
  PRIORITY_CHANGED = 'priority_changed',
  MOVED = 'moved',
}
