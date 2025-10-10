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
exports.UpdateTaskAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const update_task_assignment_request_dto_1 = require("./update-task-assignment.request.dto");
let UpdateTaskAssignmentService = class UpdateTaskAssignmentService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async updateAssignment(taskId, requestDto) {
        const currentTask = await this.getCurrentTaskState(taskId);
        if (!currentTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        await this.validateAssignmentRequest(requestDto);
        const changeMetadata = await this.calculateAssignmentChanges(currentTask, requestDto);
        const updatedAssignmentData = this.applyAssignmentUpdates(currentTask, requestDto);
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId,
            taskKey: currentTask.taskKey,
            taskTitle: currentTask.taskTitle,
            action: 'assignment_updated',
            fromStatus: currentTask.status,
            toStatus: currentTask.status,
            fromColumn: currentTask.toColumn,
            toColumn: currentTask.toColumn,
            status: 'completed',
            context: {
                updateType: 'task_assignment',
                assignmentAction: requestDto.action,
                assignmentChanges: changeMetadata,
                assignmentData: updatedAssignmentData,
                assignmentReason: requestDto.assignmentReason,
            },
            agentResponse: {
                success: true,
                assignmentUpdated: true,
                notificationsSent: requestDto.notifyAssignees ?? false,
                timestamp: new Date().toISOString(),
            },
        });
        const savedLog = await this.taskHistoryRepository.save(historyLog);
        return {
            taskId,
            action: requestDto.action,
            assignee: updatedAssignmentData.assignee,
            previousAssignee: changeMetadata.previousAssignee,
            watchers: updatedAssignmentData.watchers,
            assignmentDetails: requestDto.assignmentDetails,
            updatedBy: requestDto.updatedBy,
            updatedAt: savedLog.createdAt,
            assignmentReason: requestDto.assignmentReason,
            watchersAdded: changeMetadata.watchersAdded,
            watchersRemoved: changeMetadata.watchersRemoved,
            notificationsSent: requestDto.notifyAssignees ?? false,
            assignmentPriority: requestDto.assignmentPriority,
            success: true,
            assignmentVersion: (await this.getAssignmentVersion(taskId)) + 1,
            historyLogId: savedLog.id,
        };
    }
    async getCurrentTaskState(taskId) {
        return await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
    }
    async validateAssignmentRequest(requestDto) {
        if (!Object.values(update_task_assignment_request_dto_1.AssignmentAction).includes(requestDto.action)) {
            throw new common_1.BadRequestException(`Invalid assignment action: ${requestDto.action}`);
        }
        if (requestDto.action === update_task_assignment_request_dto_1.AssignmentAction.ASSIGN && !requestDto.assignee) {
            throw new common_1.BadRequestException('Assignee is required for assign action');
        }
        if (requestDto.action === update_task_assignment_request_dto_1.AssignmentAction.REASSIGN &&
            !requestDto.assignee) {
            throw new common_1.BadRequestException('New assignee is required for reassign action');
        }
        if (requestDto.assignmentDetails) {
            for (const detail of requestDto.assignmentDetails) {
                if (detail.startDate && detail.endDate) {
                    const start = new Date(detail.startDate);
                    const end = new Date(detail.endDate);
                    if (start >= end) {
                        throw new common_1.BadRequestException('Start date must be before end date');
                    }
                }
            }
        }
    }
    async calculateAssignmentChanges(currentTask, requestDto) {
        const currentData = currentTask.context?.assignmentData || {};
        const currentWatchers = currentData.watchers || [];
        const newWatchers = requestDto.watchers || [];
        const watchersAdded = newWatchers.filter((w) => !currentWatchers.includes(w));
        const watchersRemoved = currentWatchers.filter((w) => !newWatchers.includes(w));
        return {
            action: requestDto.action,
            previousAssignee: currentData.assignee,
            newAssignee: requestDto.assignee,
            watchersAdded,
            watchersRemoved,
            assignmentHistory: [
                {
                    userId: requestDto.updatedBy,
                    action: requestDto.action,
                    timestamp: new Date(),
                },
            ],
        };
    }
    applyAssignmentUpdates(currentTask, requestDto) {
        const currentData = currentTask.context?.assignmentData || {};
        let updatedAssignee = currentData.assignee;
        switch (requestDto.action) {
            case update_task_assignment_request_dto_1.AssignmentAction.ASSIGN:
            case update_task_assignment_request_dto_1.AssignmentAction.REASSIGN:
                updatedAssignee = requestDto.assignee;
                break;
            case update_task_assignment_request_dto_1.AssignmentAction.UNASSIGN:
                updatedAssignee = undefined;
                break;
        }
        return {
            assignee: updatedAssignee,
            watchers: requestDto.watchers || currentData.watchers || [],
            assignmentDetails: requestDto.assignmentDetails || currentData.assignmentDetails,
            assignmentPriority: requestDto.assignmentPriority || currentData.assignmentPriority,
        };
    }
    async getAssignmentVersion(taskId) {
        return await this.taskHistoryRepository.count({
            where: {
                taskId,
                action: 'assignment_updated',
            },
        });
    }
};
exports.UpdateTaskAssignmentService = UpdateTaskAssignmentService;
exports.UpdateTaskAssignmentService = UpdateTaskAssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateTaskAssignmentService);
//# sourceMappingURL=update-task-assignment.service.js.map