export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  isActive: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface AgentColumnInstruction {
  id: string;
  agentId: string;
  boardId: string;
  columnId: string;
  columnName: string;
  instructions: string;
  triggerConditions?: AgentTriggerCondition[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentTriggerCondition {
  type:
    | 'task_moved_to_column'
    | 'task_assigned'
    | 'task_priority_changed'
    | 'task_due_date_approaching';
  value?: string;
  operator?: 'equals' | 'contains' | 'greater_than' | 'less_than';
}

export interface AgentExecutionContext {
  taskId: string;
  taskData: any;
  columnId: string;
  columnName: string;
  boardId: string;
  triggerType: string;
  additionalContext?: Record<string, any>;
}

export interface AgentActivity {
  id: string;
  agentId: string;
  taskId: string;
  action: string;
  result: 'success' | 'error' | 'pending';
  input: any;
  output?: any;
  error?: string;
  executionTime: number;
  createdAt: Date;
}

export interface ContextSource {
  type: 'task' | 'related_tasks' | 'board' | 'external_api' | 'database';
  config: Record<string, any>;
  isActive: boolean;
}

export interface AgentContextConfig {
  agentId: string;
  sources: ContextSource[];
  maxContextTokens: number;
  includeTaskHistory: boolean;
  includeRelatedTasks: boolean;
}
