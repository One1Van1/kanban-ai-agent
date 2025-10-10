"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetBoardStructure = ApiGetBoardStructure;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_board_structure_response_dto_1 = require("./get-board-structure.response.dto");
function ApiGetBoardStructure() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Get kanban board structure',
        description: `
        Retrieves the complete structure of the kanban board including columns, workflow rules,
        and optional metadata. This endpoint is essential for AI agents to understand the board
        layout and available operations.

        **Key Features:**
        - Returns all board columns with their properties
        - Provides workflow rules and allowed status transitions
        - Optional task counts per column
        - Optional sample tasks for AI context
        - Configurable level of detail

        **Board Structure Information:**
        - Column definitions (name, order, allowed statuses)
        - WIP limits and descriptions
        - Status transition rules
        - Task counts and samples
        - Workflow validation rules

        **Use Cases:**
        - AI agent understanding board layout
        - Dynamic UI generation
        - Workflow validation
        - Task placement decisions
        - Status transition planning

        **Response Customization:**
        Use query parameters to control the amount of information returned:
        - includeTaskCounts: Get current task counts per column
        - includeMetadata: Get detailed column and board metadata
        - includeStatusTransitions: Get allowed status transitions
        - includeSampleTasks: Get example tasks for AI context
        - sampleTasksLimit: Control number of sample tasks

        **AI Agent Context:**
        This endpoint provides essential context for AI agents to:
        - Understand where to place new tasks
        - Validate task movements
        - Suggest appropriate status changes
        - Understand workflow constraints
      `,
        tags: ['Kanban Management', 'Board Structure'],
    }), (0, swagger_1.ApiQuery)({
        name: 'boardId',
        description: 'Filter structure by specific board/project ID',
        required: false,
        type: 'string',
        example: 'project-alpha',
    }), (0, swagger_1.ApiQuery)({
        name: 'includeTaskCounts',
        description: 'Include task counts for each column',
        required: false,
        type: 'boolean',
        example: true,
    }), (0, swagger_1.ApiQuery)({
        name: 'includeMetadata',
        description: 'Include detailed column metadata (WIP limits, descriptions, etc.)',
        required: false,
        type: 'boolean',
        example: false,
    }), (0, swagger_1.ApiQuery)({
        name: 'includeStatusTransitions',
        description: 'Include available status transitions for each column',
        required: false,
        type: 'boolean',
        example: true,
    }), (0, swagger_1.ApiQuery)({
        name: 'includeSampleTasks',
        description: 'Include sample tasks for each column (useful for AI context)',
        required: false,
        type: 'boolean',
        example: false,
    }), (0, swagger_1.ApiQuery)({
        name: 'sampleTasksLimit',
        description: 'Number of sample tasks to include per column (1-10)',
        required: false,
        type: 'number',
        example: 3,
    }), (0, swagger_1.ApiQuery)({
        name: 'agentId',
        description: 'ID of the agent requesting board structure',
        required: false,
        type: 'string',
        example: 'uuid-agent-123',
    }), (0, swagger_1.ApiQuery)({
        name: 'purpose',
        description: 'Context of why board structure is needed',
        required: false,
        type: 'string',
        example: 'task_assignment',
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Board structure retrieved successfully',
        type: get_board_structure_response_dto_1.GetBoardStructureResponseDto,
        content: {
            'application/json': {
                examples: {
                    minimal_structure: {
                        summary: 'Minimal board structure',
                        value: {
                            success: true,
                            message: 'Board structure retrieved successfully',
                            boardId: 'default-board',
                            boardName: 'Kanban Board default-board',
                            columns: [
                                {
                                    id: 'backlog',
                                    name: 'backlog',
                                    displayName: 'Backlog',
                                    order: 0,
                                    allowedStatuses: ['todo'],
                                    statusTransitions: ['in-progress', 'blocked'],
                                    description: 'Tasks waiting to be started',
                                    color: '#6b7280',
                                },
                                {
                                    id: 'todo',
                                    name: 'todo',
                                    displayName: 'To Do',
                                    order: 1,
                                    allowedStatuses: ['todo'],
                                    statusTransitions: ['in-progress', 'blocked', 'cancelled'],
                                    description: 'Tasks ready to be started',
                                    color: '#64748b',
                                },
                                {
                                    id: 'in-progress',
                                    name: 'in-progress',
                                    displayName: 'In Progress',
                                    order: 2,
                                    allowedStatuses: ['in-progress'],
                                    statusTransitions: [
                                        'in-review',
                                        'blocked',
                                        'todo',
                                        'cancelled',
                                    ],
                                    wipLimit: 5,
                                    description: 'Tasks currently being worked on',
                                    color: '#3b82f6',
                                },
                                {
                                    id: 'done',
                                    name: 'done',
                                    displayName: 'Done',
                                    order: 5,
                                    allowedStatuses: ['done'],
                                    statusTransitions: ['in-review', 'testing'],
                                    description: 'Completed tasks',
                                    color: '#10b981',
                                },
                            ],
                            workflow: {
                                name: 'Standard Development Workflow',
                                description: 'Default workflow for development tasks with proper quality gates',
                                allowedTransitions: {
                                    todo: ['in-progress', 'blocked', 'cancelled'],
                                    'in-progress': [
                                        'in-review',
                                        'blocked',
                                        'todo',
                                        'cancelled',
                                    ],
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
                            totalTasks: 0,
                            timestamp: '2024-01-01T12:00:00.000Z',
                        },
                    },
                    detailed_structure: {
                        summary: 'Detailed board structure with all metadata',
                        value: {
                            success: true,
                            message: 'Board structure retrieved successfully',
                            boardId: 'project-alpha',
                            boardName: 'Kanban Board project-alpha',
                            columns: [
                                {
                                    id: 'backlog',
                                    name: 'backlog',
                                    displayName: 'Backlog',
                                    order: 0,
                                    taskCount: 15,
                                    allowedStatuses: ['todo'],
                                    statusTransitions: ['in-progress', 'blocked'],
                                    description: 'Tasks waiting to be started',
                                    color: '#6b7280',
                                    metadata: {
                                        defaultPriority: 'medium',
                                        autoAssignment: false,
                                        category: 'planning',
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
                                        {
                                            id: 'task-124',
                                            title: 'Setup database schema',
                                            status: 'todo',
                                            priority: 'medium',
                                            createdAt: '2024-01-01T09:00:00Z',
                                        },
                                    ],
                                },
                                {
                                    id: 'in-progress',
                                    name: 'in-progress',
                                    displayName: 'In Progress',
                                    order: 2,
                                    taskCount: 5,
                                    allowedStatuses: ['in-progress'],
                                    statusTransitions: [
                                        'in-review',
                                        'blocked',
                                        'todo',
                                        'cancelled',
                                    ],
                                    wipLimit: 5,
                                    description: 'Tasks currently being worked on',
                                    color: '#3b82f6',
                                    metadata: {
                                        requiresAssignment: true,
                                        trackTime: true,
                                        category: 'active',
                                    },
                                    sampleTasks: [
                                        {
                                            id: 'task-125',
                                            title: 'Fix login bug',
                                            status: 'in-progress',
                                            assignee: 'dev@example.com',
                                            priority: 'urgent',
                                            createdAt: '2024-01-01T08:00:00Z',
                                        },
                                    ],
                                },
                            ],
                            workflow: {
                                name: 'Standard Development Workflow',
                                description: 'Default workflow for development tasks with proper quality gates',
                                allowedTransitions: {
                                    todo: ['in-progress', 'blocked', 'cancelled'],
                                    'in-progress': [
                                        'in-review',
                                        'blocked',
                                        'todo',
                                        'cancelled',
                                    ],
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
                            totalTasks: 47,
                            timestamp: '2024-01-01T12:00:00.000Z',
                            metadata: {
                                lastUpdated: '2024-01-01T11:30:00Z',
                                activeUsers: 8,
                                recentActivity: '47 total tasks',
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
                                    wipLimitsEnabled: true,
                                },
                                requestedBy: 'task-planner-agent',
                                purpose: 'task_assignment',
                            },
                        },
                    },
                    agent_context: {
                        summary: 'Structure optimized for AI agent context',
                        value: {
                            success: true,
                            message: 'Board structure retrieved successfully',
                            boardId: 'ai-project',
                            boardName: 'AI Development Board',
                            columns: [
                                {
                                    id: 'todo',
                                    name: 'todo',
                                    displayName: 'To Do',
                                    order: 1,
                                    taskCount: 8,
                                    allowedStatuses: ['todo'],
                                    statusTransitions: ['in-progress', 'blocked', 'cancelled'],
                                    description: 'Tasks ready to be started',
                                    color: '#64748b',
                                    sampleTasks: [
                                        {
                                            id: 'ai-task-1',
                                            title: 'Train new ML model',
                                            status: 'todo',
                                            priority: 'high',
                                            createdAt: '2024-01-01T10:00:00Z',
                                        },
                                        {
                                            id: 'ai-task-2',
                                            title: 'Optimize inference pipeline',
                                            status: 'todo',
                                            assignee: 'ml-engineer@example.com',
                                            priority: 'medium',
                                            createdAt: '2024-01-01T09:30:00Z',
                                        },
                                    ],
                                },
                            ],
                            workflow: {
                                name: 'AI Development Workflow',
                                description: 'Specialized workflow for AI/ML development tasks',
                                allowedTransitions: {
                                    todo: ['in-progress', 'blocked'],
                                    'in-progress': ['testing', 'blocked'],
                                },
                                statuses: [
                                    'todo',
                                    'in-progress',
                                    'testing',
                                    'done',
                                    'blocked',
                                ],
                            },
                            totalTasks: 23,
                            timestamp: '2024-01-01T12:00:00.000Z',
                        },
                    },
                },
            },
        },
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid query parameters',
        content: {
            'application/json': {
                examples: {
                    invalid_limit: {
                        summary: 'Invalid sample tasks limit',
                        value: {
                            statusCode: 400,
                            message: [
                                'sampleTasksLimit must not be greater than 10',
                                'sampleTasksLimit must not be less than 1',
                            ],
                            error: 'Bad Request',
                        },
                    },
                    invalid_boolean: {
                        summary: 'Invalid boolean parameter',
                        value: {
                            statusCode: 400,
                            message: ['includeTaskCounts must be a boolean value'],
                            error: 'Bad Request',
                        },
                    },
                },
            },
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during structure retrieval',
        example: {
            statusCode: 500,
            message: 'Failed to retrieve board structure',
            error: 'Internal Server Error',
        },
    }));
}
//# sourceMappingURL=openapi.decorator.js.map