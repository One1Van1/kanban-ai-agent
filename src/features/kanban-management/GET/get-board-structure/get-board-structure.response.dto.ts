import { ApiProperty } from '@nestjs/swagger';

export interface ColumnInfo {
  id: string;
  name: string;
  displayName: string;
  order: number;
  taskCount?: number;
  allowedStatuses: string[];
  statusTransitions?: string[];
  wipLimit?: number;
  description?: string;
  color?: string;
  metadata?: Record<string, any>;
  sampleTasks?: TaskSample[];
}

export interface TaskSample {
  id: string;
  title: string;
  status: string;
  assignee?: string;
  priority?: string;
  createdAt: Date;
}

export interface BoardWorkflow {
  name: string;
  description: string;
  allowedTransitions: Record<string, string[]>;
  statuses: string[];
}

export class GetBoardStructureResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the request was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Board structure retrieved successfully',
    description: 'Human-readable message about the operation result',
  })
  message: string;

  @ApiProperty({
    example: 'project-alpha',
    description: 'ID or name of the board',
  })
  boardId: string;

  @ApiProperty({
    example: 'Project Alpha Kanban Board',
    description: 'Human-readable name of the board',
  })
  boardName: string;

  @ApiProperty({
    type: [Object],
    description: 'Array of column information',
    example: [
      {
        id: 'backlog',
        name: 'backlog',
        displayName: 'Backlog',
        order: 0,
        taskCount: 15,
        allowedStatuses: ['todo'],
        statusTransitions: ['in-progress', 'blocked'],
        wipLimit: null,
        description: 'Tasks waiting to be started',
        color: '#gray',
        metadata: {
          defaultPriority: 'medium',
          autoAssignment: false,
        },
        sampleTasks: [
          {
            id: 'task-123',
            title: 'Implement user authentication',
            status: 'todo',
            assignee: 'john.doe@example.com',
            priority: 'high',
            createdAt: '2024-01-01T10:00:00Z',
          },
        ],
      },
    ],
  })
  columns: ColumnInfo[];

  @ApiProperty({
    type: Object,
    description: 'Workflow rules and allowed status transitions',
    example: {
      name: 'Standard Development Workflow',
      description: 'Default workflow for development tasks',
      allowedTransitions: {
        todo: ['in-progress', 'blocked', 'cancelled'],
        'in-progress': ['in-review', 'blocked', 'todo', 'cancelled'],
        'in-review': ['testing', 'in-progress', 'done', 'blocked'],
        testing: ['done', 'in-review', 'blocked'],
        done: ['in-review', 'testing'],
        blocked: ['todo', 'in-progress', 'cancelled'],
        cancelled: ['todo'],
      },
      statuses: [
        'todo',
        'in-progress',
        'in-review',
        'testing',
        'done',
        'blocked',
        'cancelled',
      ],
    },
  })
  workflow: BoardWorkflow;

  @ApiProperty({
    example: 47,
    description: 'Total number of tasks across all columns',
  })
  totalTasks: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Timestamp when structure was retrieved',
  })
  timestamp: string;

  @ApiProperty({
    type: Object,
    description: 'Additional metadata about the board and operation',
    example: {
      lastUpdated: '2024-01-01T11:30:00Z',
      activeUsers: 8,
      recentActivity: '15 tasks moved today',
      agentAccessLevel: 'full',
      availableActions: [
        'create',
        'move',
        'assign',
        'comment',
        'status_change',
      ],
      boardSettings: {
        autoAssignment: true,
        notifications: true,
        wipLimitsEnabled: false,
      },
    },
    required: false,
  })
  metadata?: Record<string, any>;
}
