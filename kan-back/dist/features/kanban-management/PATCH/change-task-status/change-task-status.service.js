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
exports.ChangeTaskStatusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const change_task_status_request_dto_1 = require("./change-task-status.request.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let ChangeTaskStatusService = class ChangeTaskStatusService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    allowedStatusTransitions = {
        [change_task_status_request_dto_1.TaskStatus.TODO]: [
            change_task_status_request_dto_1.TaskStatus.IN_PROGRESS,
            change_task_status_request_dto_1.TaskStatus.BLOCKED,
            change_task_status_request_dto_1.TaskStatus.CANCELLED,
        ],
        [change_task_status_request_dto_1.TaskStatus.IN_PROGRESS]: [
            change_task_status_request_dto_1.TaskStatus.IN_REVIEW,
            change_task_status_request_dto_1.TaskStatus.BLOCKED,
            change_task_status_request_dto_1.TaskStatus.TODO,
            change_task_status_request_dto_1.TaskStatus.CANCELLED,
        ],
        [change_task_status_request_dto_1.TaskStatus.IN_REVIEW]: [
            change_task_status_request_dto_1.TaskStatus.TESTING,
            change_task_status_request_dto_1.TaskStatus.IN_PROGRESS,
            change_task_status_request_dto_1.TaskStatus.DONE,
            change_task_status_request_dto_1.TaskStatus.BLOCKED,
        ],
        [change_task_status_request_dto_1.TaskStatus.TESTING]: [
            change_task_status_request_dto_1.TaskStatus.DONE,
            change_task_status_request_dto_1.TaskStatus.IN_REVIEW,
            change_task_status_request_dto_1.TaskStatus.BLOCKED,
        ],
        [change_task_status_request_dto_1.TaskStatus.DONE]: [change_task_status_request_dto_1.TaskStatus.IN_REVIEW, change_task_status_request_dto_1.TaskStatus.TESTING],
        [change_task_status_request_dto_1.TaskStatus.BLOCKED]: [
            change_task_status_request_dto_1.TaskStatus.TODO,
            change_task_status_request_dto_1.TaskStatus.IN_PROGRESS,
            change_task_status_request_dto_1.TaskStatus.CANCELLED,
        ],
        [change_task_status_request_dto_1.TaskStatus.CANCELLED]: [change_task_status_request_dto_1.TaskStatus.TODO],
    };
    isValidStatusTransition(fromStatus, toStatus, forceChange = false) {
        if (forceChange)
            return true;
        if (fromStatus === toStatus)
            return true;
        const allowedTransitions = this.allowedStatusTransitions[fromStatus];
        return allowedTransitions?.includes(toStatus) || false;
    }
    calculateTimeInStatus(createdAt) {
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (diffDays > 0) {
            return `${diffDays} days ${diffHours} hours`;
        }
        return `${diffHours} hours`;
    }
    async execute(taskId, statusDto) {
        const existingTask = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!existingTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const currentStatus = existingTask.toStatus;
        const newStatus = statusDto.newStatus;
        if (!this.isValidStatusTransition(currentStatus, newStatus, statusDto.forceChange)) {
            throw new common_1.BadRequestException(`Invalid status transition from '${currentStatus}' to '${newStatus}'. ` +
                `Allowed transitions: ${this.allowedStatusTransitions[currentStatus]?.join(', ') || 'none'}`);
        }
        const statusChangeHistory = this.taskHistoryRepository.create({
            taskId: taskId,
            taskKey: existingTask.taskKey,
            taskTitle: existingTask.taskTitle,
            action: 'status_changed',
            fromColumn: existingTask.toColumn,
            toColumn: existingTask.toColumn,
            fromStatus: currentStatus,
            toStatus: newStatus,
            status: 'completed',
            context: {
                ...existingTask.context,
                ...statusDto.context,
                statusChange: {
                    fromStatus: currentStatus,
                    toStatus: newStatus,
                    changedByEmail: statusDto.changedByEmail || '',
                    changedByName: statusDto.changedByName || statusDto.changedByEmail || 'System',
                    statusComment: statusDto.statusComment || '',
                    changedAt: new Date().toISOString(),
                    forceChange: statusDto.forceChange || false,
                    timeInPreviousStatus: this.calculateTimeInStatus(existingTask.createdAt),
                },
            },
            agentId: statusDto.agentId || existingTask.agentId || 'system',
            agentResponse: {
                success: true,
                message: `Status changed from ${currentStatus} to ${newStatus}`,
                timestamp: new Date().toISOString(),
                triggerType: statusDto.triggerType || 'manual',
                statusTransition: `${currentStatus} -> ${newStatus}`,
                workflowValidation: statusDto.forceChange ? 'bypassed' : 'passed',
            },
        });
        const savedStatusChange = await this.taskHistoryRepository.save(statusChangeHistory);
        return {
            success: true,
            message: `Task status changed from ${currentStatus} to ${newStatus}`,
            taskId: taskId,
            previousStatus: currentStatus,
            currentStatus: newStatus,
            statusChange: {
                id: savedStatusChange.id,
                taskId: taskId,
                fromStatus: currentStatus,
                toStatus: newStatus,
                changedByEmail: statusDto.changedByEmail,
                changedByName: statusDto.changedByName,
                statusComment: statusDto.statusComment,
                changedAt: savedStatusChange.createdAt,
                context: statusDto.context,
                agentId: statusDto.agentId,
                triggerType: statusDto.triggerType,
                forceChange: statusDto.forceChange,
            },
            timestamp: savedStatusChange.createdAt.toISOString(),
            metadata: {
                workflowValidation: statusDto.forceChange ? 'bypassed' : 'passed',
                timeInPreviousStatus: this.calculateTimeInStatus(existingTask.createdAt),
                allowedNextStatuses: this.allowedStatusTransitions[newStatus] || [],
                queueJobId: `status-${savedStatusChange.id}`,
                notificationsSent: ['email'],
            },
        };
    }
};
exports.ChangeTaskStatusService = ChangeTaskStatusService;
exports.ChangeTaskStatusService = ChangeTaskStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChangeTaskStatusService);
//# sourceMappingURL=change-task-status.service.js.map