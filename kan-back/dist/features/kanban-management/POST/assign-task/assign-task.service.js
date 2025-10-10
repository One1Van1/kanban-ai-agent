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
exports.AssignTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let AssignTaskService = class AssignTaskService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, assignDto) {
        const existingTask = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!existingTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const assignmentHistory = this.taskHistoryRepository.create({
            taskId: taskId,
            taskKey: existingTask.taskKey,
            taskTitle: existingTask.taskTitle,
            action: 'task_assigned',
            fromColumn: existingTask.toColumn,
            toColumn: existingTask.toColumn,
            fromStatus: existingTask.toStatus,
            toStatus: existingTask.toStatus,
            status: 'completed',
            context: {
                ...existingTask.context,
                ...assignDto.context,
                assignment: {
                    assigneeEmail: assignDto.assigneeEmail,
                    assigneeName: assignDto.assigneeName || assignDto.assigneeEmail,
                    assignedByEmail: assignDto.assignedByEmail || '',
                    assignedByName: assignDto.assignedByName || assignDto.assignedByEmail || 'System',
                    assignmentMessage: assignDto.assignmentMessage || '',
                    assignedAt: new Date().toISOString(),
                    previousAssignee: existingTask.context?.assignment?.assigneeEmail || null,
                },
            },
            agentId: assignDto.agentId || existingTask.agentId || 'system',
            agentResponse: {
                success: true,
                message: `Task assigned to ${assignDto.assigneeEmail}`,
                timestamp: new Date().toISOString(),
                triggerType: assignDto.triggerType || 'manual',
                assigneeEmail: assignDto.assigneeEmail,
                assigneeName: assignDto.assigneeName,
            },
        });
        const savedAssignment = await this.taskHistoryRepository.save(assignmentHistory);
        return {
            success: true,
            message: `Task successfully assigned to ${assignDto.assigneeEmail}`,
            taskId: taskId,
            assignment: {
                id: savedAssignment.id,
                taskId: taskId,
                assigneeEmail: assignDto.assigneeEmail,
                assigneeName: assignDto.assigneeName,
                assignedByEmail: assignDto.assignedByEmail,
                assignedByName: assignDto.assignedByName,
                assignmentMessage: assignDto.assignmentMessage,
                assignedAt: savedAssignment.createdAt,
                context: assignDto.context,
                agentId: assignDto.agentId,
                triggerType: assignDto.triggerType,
            },
            timestamp: savedAssignment.createdAt.toISOString(),
            metadata: {
                previousAssignee: existingTask.context?.assignment?.assigneeEmail || null,
                queueJobId: `assign-${savedAssignment.id}`,
                notificationsSent: ['email'],
            },
        };
    }
};
exports.AssignTaskService = AssignTaskService;
exports.AssignTaskService = AssignTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AssignTaskService);
//# sourceMappingURL=assign-task.service.js.map