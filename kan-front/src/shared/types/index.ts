// AI Agent Types
export interface Agent {
  id: string;
  name: string;
  description?: string;
  role: string;
  specialization: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Agent response type - matches backend response
export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'paused';
  boardType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAgentsResponse {
  agents: AgentSummary[];
  total: number;
}

export interface AgentInstruction {
  id: string;
  agentId: string;
  boardId: string;
  columnId: string;
  instruction: string;
  triggerType: 'column_entry' | 'column_exit' | 'status_change' | 'assignment';
  createdAt: string;
}

export interface AgentActivity {
  id: string;
  agentId: string;
  taskId: string;
  actionType: string;
  description: string;
  timestamp: string;
  success: boolean;
  data?: any;
}

// Flow Builder API Types (Legacy)
export interface FlowBuilderSaveResponse {
  success: boolean;
  message: string;
  createdAgent: {
    id: string;
    name: string;
    description: string;
    instructions: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
    createdAt: string;
  };
  createdInstructions: any[];
  flowId: string;
}

// Flow Management API Types
export interface FlowManagementResponse {
  flowId: string;
  name: string;
  description?: string;
  definition: any;
  status: 'draft' | 'active' | 'archived';
  agentId?: string;
  metadata?: {
    version?: number;
    tags?: string[];
    category?: string;
    [key: string]: any;
  };
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListFlowsResponse {
  items: Array<{
    flowId: string;
    name: string;
    description?: string;
    status: 'draft' | 'active' | 'archived';
    agentId?: string;
    blockCount: number;
    metadata?: any;
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FlowExecutionResponse {
  executionId: string;
  flowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  instructions: string[];
  context?: any;
  variables?: any;
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface FlowCloneResponse {
  flowId: string;
  name: string;
  description?: string;
  definition: any;
  status: 'draft';
  metadata?: any;
  clonedBy: string;
  clonedFrom: string;
  createdAt: string;
}

// Kanban Types
export interface Task {
  id: string;
  key: string;
  summary: string;
  description?: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee?: string;
  assigneeEmail?: string;
  creator?: string;
  creatorEmail?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  labels?: string[];
  telegramField?: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  columns: BoardColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
  maxTasks?: number;
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  reactions?: CommentReaction[];
}

export interface CommentReaction {
  id: string;
  commentId: string;
  emoji: string;
  userId: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  changeType: 'created' | 'updated' | 'deleted' | 'moved';
  changedBy: string;
  timestamp: string;
  agentId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface CreateAgentForm {
  name: string;
  description?: string;
  role: string;
  specialization: string;
}

export interface CreateTaskForm {
  summary: string;
  description?: string;
  priority: Task['priority'];
  assigneeEmail?: string;
  dueDate?: string;
  estimatedHours?: number;
  labels?: string[];
}

export interface MoveTaskForm {
  targetColumnId: string;
  position?: number;
}

// Dashboard Types
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueeTasks: number;
  activeAgents: number;
  totalAgents: number;
  agentActions24h: number;
  averageCompletionTime: number;
}

export interface TeamPerformance {
  teamMember: string;
  tasksCompleted: number;
  averageCompletionTime: number;
  efficiency: number;
}

// Socket Events
export interface SocketEvents {
  'agent-activity': AgentActivity;
  'task-moved': { taskId: string; fromColumn: string; toColumn: string };
  'task-created': Task;
  'task-updated': Task;
  'comment-added': Comment;
}
