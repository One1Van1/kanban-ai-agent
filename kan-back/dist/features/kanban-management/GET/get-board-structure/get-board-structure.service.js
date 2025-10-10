"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBoardStructureService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetBoardStructureService = class GetBoardStructureService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    defaultColumns = [
        {
            id: 'backlog',
            name: 'backlog',
            displayName: 'Backlog',
            order: 0,
            allowedStatuses: ['todo'],
            statusTransitions: ['in-progress', 'blocked'],
            description: 'Tasks waiting to be started',
            color: '#6b7280',
            metadata: {
                defaultPriority: 'medium',
                autoAssignment: false,
                category: 'planning',
            },
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
            metadata: {
                wipLimit: null,
                requiresAssignment: false,
                category: 'ready',
            },
        },
        {
            id: 'in-progress',
            name: 'in-progress',
            displayName: 'In Progress',
            order: 2,
            allowedStatuses: ['in-progress'],
            statusTransitions: ['in-review', 'blocked', 'todo', 'cancelled'],
            wipLimit: 5,
            description: 'Tasks currently being worked on',
            color: '#3b82f6',
            metadata: {
                requiresAssignment: true,
                trackTime: true,
                category: 'active',
            },
        },
        {
            id: 'in-review',
            name: 'in-review',
            displayName: 'In Review',
            order: 3,
            allowedStatuses: ['in-review'],
            statusTransitions: ['testing', 'in-progress', 'done', 'blocked'],
            wipLimit: 3,
            description: 'Tasks under review',
            color: '#8b5cf6',
            metadata: {
                requiresReviewer: true,
                category: 'review',
            },
        },
        {
            id: 'testing',
            name: 'testing',
            displayName: 'Testing',
            order: 4,
            allowedStatuses: ['testing'],
            statusTransitions: ['done', 'in-review', 'blocked'],
            wipLimit: 3,
            description: 'Tasks being tested',
            color: '#f59e0b',
            metadata: {
                requiresTester: true,
                category: 'quality',
            },
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
            metadata: {
                archiveAfterDays: 30,
                category: 'completed',
            },
        },
        {
            id: 'blocked',
            name: 'blocked',
            displayName: 'Blocked',
            order: 6,
            allowedStatuses: ['blocked'],
            statusTransitions: ['todo', 'in-progress', 'cancelled'],
            description: 'Tasks that are blocked',
            color: '#ef4444',
            metadata: {
                requiresReason: true,
                escalateAfterDays: 3,
                category: 'blocked',
            },
        },
        {
            id: 'cancelled',
            name: 'cancelled',
            displayName: 'Cancelled',
            order: 7,
            allowedStatuses: ['cancelled'],
            statusTransitions: ['todo'],
            description: 'Cancelled tasks',
            color: '#6b7280',
            metadata: {
                archiveAfterDays: 7,
                category: 'archived',
            },
        },
    ];
    defaultWorkflow = {
        name: 'Standard Development Workflow',
        description: 'Default workflow for development tasks with proper quality gates',
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
    };
    async getTaskCountByColumn(columnName, boardId) {
        try {
            const queryBuilder = this.taskHistoryRepository
                .createQueryBuilder('task_history')
                .select('DISTINCT task_history.taskId')
                .where('task_history.toColumn = :columnName', { columnName })
                .andWhere('task_history.id = (SELECT MAX(th2.id) FROM task_history th2 WHERE th2.taskId = task_history.taskId)');
            if (boardId) {
                queryBuilder.andWhere('task_history.context @> :boardFilter', {
                    boardFilter: JSON.stringify({ boardId }),
                });
            }
            const result = await queryBuilder.getRawMany();
            return result.length;
        }
        catch (error) {
            console.warn(`Failed to get task count for column ${columnName}:`, error);
            return 0;
        }
    }
    async getSampleTasks(columnName, limit, boardId) {
        try {
            const queryBuilder = this.taskHistoryRepository
                .createQueryBuilder('task_history')
                .where('task_history.toColumn = :columnName', { columnName })
                .andWhere('task_history.id = (SELECT MAX(th2.id) FROM task_history th2 WHERE th2.taskId = task_history.taskId)')
                .orderBy('task_history.createdAt', 'DESC')
                .limit(limit);
            if (boardId) {
                queryBuilder.andWhere('task_history.context @> :boardFilter', {
                    boardFilter: JSON.stringify({ boardId }),
                });
            }
            const tasks = await queryBuilder.getMany();
            return tasks.map((task) => ({
                id: task.taskId,
                title: task.taskTitle || `Task ${task.taskKey || task.taskId}`,
                status: task.toStatus || columnName,
                assignee: task.context?.assignment?.assigneeEmail ||
                    task.context?.assignee ||
                    undefined,
                priority: task.context?.priority || 'medium',
                createdAt: task.createdAt,
            }));
        }
        catch (error) {
            console.warn(`Failed to get sample tasks for column ${columnName}:`, error);
            return [];
        }
    }
    async execute(queryDto) {
        const boardId = queryDto.boardId || 'default-board';
        const includeTaskCounts = queryDto.includeTaskCounts ?? true;
        const includeMetadata = queryDto.includeMetadata ?? false;
        const includeStatusTransitions = queryDto.includeStatusTransitions ?? true;
        const includeSampleTasks = queryDto.includeSampleTasks ?? false;
        const sampleTasksLimit = queryDto.sampleTasksLimit ?? 3;
        const columns = await Promise.all(this.defaultColumns.map(async (column) => {
            const columnInfo = {
                ...column,
                statusTransitions: includeStatusTransitions
                    ? column.statusTransitions
                    : undefined,
                metadata: includeMetadata ? column.metadata : undefined,
            };
            if (includeTaskCounts) {
                columnInfo.taskCount = await this.getTaskCountByColumn(column.name, queryDto.boardId);
            }
            if (includeSampleTasks) {
                columnInfo.sampleTasks = await this.getSampleTasks(column.name, sampleTasksLimit, queryDto.boardId);
            }
            return columnInfo;
        }));
        const totalTasks = includeTaskCounts
            ? columns.reduce((sum, col) => sum + (col.taskCount || 0), 0)
            : 0;
        const metadata = includeMetadata
            ? {
                lastUpdated: new Date().toISOString(),
                activeUsers: 8,
                recentActivity: `${totalTasks} total tasks`,
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
                requestedBy: queryDto.agentId || 'unknown',
                purpose: queryDto.purpose || 'general_inquiry',
            }
            : undefined;
        return {
            success: true,
            message: 'Board structure retrieved successfully',
            boardId: boardId,
            boardName: `Kanban Board ${boardId}`,
            columns: columns,
            workflow: this.defaultWorkflow,
            totalTasks: totalTasks,
            timestamp: new Date().toISOString(),
            metadata: metadata,
        };
    }
};
exports.GetBoardStructureService = GetBoardStructureService;
exports.GetBoardStructureService = GetBoardStructureService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetBoardStructureService);
//# sourceMappingURL=get-board-structure.service.js.map