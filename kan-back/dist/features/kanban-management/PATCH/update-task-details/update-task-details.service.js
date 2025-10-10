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
exports.UpdateTaskDetailsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const update_task_details_request_dto_1 = require("./update-task-details.request.dto");
let UpdateTaskDetailsService = class UpdateTaskDetailsService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async updateDetails(taskId, requestDto) {
        const currentTask = await this.getCurrentTaskState(taskId);
        if (!currentTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        await this.validateUpdateRequest(requestDto);
        const updateMetadata = this.calculateUpdateMetadata(currentTask, requestDto);
        if (updateMetadata.fieldsUpdated.length === 0) {
            throw new common_1.BadRequestException('No fields to update provided');
        }
        const updatedTaskData = this.applyUpdates(currentTask, requestDto);
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId,
            taskKey: currentTask.taskKey,
            taskTitle: updatedTaskData.title,
            action: 'task_updated',
            fromStatus: currentTask.status,
            toStatus: currentTask.status,
            fromColumn: currentTask.toColumn,
            toColumn: currentTask.toColumn,
            status: 'completed',
            context: {
                updateType: 'task_details',
                fieldsUpdated: updateMetadata.fieldsUpdated,
                previousValues: updateMetadata.previousValues,
                newValues: updateMetadata.newValues,
                updateComment: requestDto.updateComment,
                taskData: updatedTaskData,
            },
            agentResponse: {
                success: true,
                updateApplied: true,
                fieldsModified: updateMetadata.fieldsUpdated.length,
                timestamp: new Date().toISOString(),
            },
        });
        const savedLog = await this.taskHistoryRepository.save(historyLog);
        return {
            taskId,
            title: updatedTaskData.title,
            description: updatedTaskData.description,
            priority: updatedTaskData.priority,
            type: updatedTaskData.type,
            assignee: updatedTaskData.assignee,
            reporter: updatedTaskData.reporter,
            labels: updatedTaskData.labels,
            estimatedHours: updatedTaskData.estimatedHours,
            storyPoints: updatedTaskData.storyPoints,
            dueDate: updatedTaskData.dueDate,
            customFields: updatedTaskData.customFields,
            updatedBy: requestDto.updatedBy,
            updatedAt: savedLog.createdAt,
            fieldsUpdated: updateMetadata.fieldsUpdated,
            previousValues: updateMetadata.previousValues,
            updateComment: requestDto.updateComment,
            success: true,
            version: (await this.getTaskVersion(taskId)) + 1,
            historyLogId: savedLog.id,
        };
    }
    async getCurrentTaskState(taskId) {
        return await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
    }
    async validateUpdateRequest(requestDto) {
        if (requestDto.priority &&
            !Object.values(update_task_details_request_dto_1.TaskPriority).includes(requestDto.priority)) {
            throw new common_1.BadRequestException(`Invalid priority: ${requestDto.priority}`);
        }
        if (requestDto.type && !Object.values(update_task_details_request_dto_1.TaskType).includes(requestDto.type)) {
            throw new common_1.BadRequestException(`Invalid task type: ${requestDto.type}`);
        }
        if (requestDto.estimatedHours !== undefined &&
            requestDto.estimatedHours < 0) {
            throw new common_1.BadRequestException('Estimated hours cannot be negative');
        }
        if (requestDto.storyPoints !== undefined && requestDto.storyPoints < 0) {
            throw new common_1.BadRequestException('Story points cannot be negative');
        }
        if (requestDto.dueDate) {
            const dueDate = new Date(requestDto.dueDate);
            if (isNaN(dueDate.getTime())) {
                throw new common_1.BadRequestException('Invalid due date format');
            }
        }
        if (requestDto.labels) {
            const invalidLabels = requestDto.labels.filter((label) => !label || label.trim().length === 0);
            if (invalidLabels.length > 0) {
                throw new common_1.BadRequestException('Labels cannot be empty');
            }
        }
    }
    calculateUpdateMetadata(currentTask, requestDto) {
        const fieldsUpdated = [];
        const previousValues = {};
        const newValues = {};
        const currentData = currentTask.context?.taskData || {
            title: currentTask.taskTitle,
            priority: update_task_details_request_dto_1.TaskPriority.MEDIUM,
            type: update_task_details_request_dto_1.TaskType.TASK,
        };
        if (requestDto.title && requestDto.title !== currentData.title) {
            fieldsUpdated.push('title');
            previousValues.title = currentData.title;
            newValues.title = requestDto.title;
        }
        if (requestDto.description &&
            requestDto.description !== currentData.description) {
            fieldsUpdated.push('description');
            previousValues.description = currentData.description;
            newValues.description = requestDto.description;
        }
        if (requestDto.priority && requestDto.priority !== currentData.priority) {
            fieldsUpdated.push('priority');
            previousValues.priority = currentData.priority;
            newValues.priority = requestDto.priority;
        }
        if (requestDto.type && requestDto.type !== currentData.type) {
            fieldsUpdated.push('type');
            previousValues.type = currentData.type;
            newValues.type = requestDto.type;
        }
        if (requestDto.assignee && requestDto.assignee !== currentData.assignee) {
            fieldsUpdated.push('assignee');
            previousValues.assignee = currentData.assignee;
            newValues.assignee = requestDto.assignee;
        }
        if (requestDto.reporter && requestDto.reporter !== currentData.reporter) {
            fieldsUpdated.push('reporter');
            previousValues.reporter = currentData.reporter;
            newValues.reporter = requestDto.reporter;
        }
        if (requestDto.labels &&
            JSON.stringify(requestDto.labels) !== JSON.stringify(currentData.labels)) {
            fieldsUpdated.push('labels');
            previousValues.labels = currentData.labels;
            newValues.labels = requestDto.labels;
        }
        if (requestDto.estimatedHours !== undefined &&
            requestDto.estimatedHours !== currentData.estimatedHours) {
            fieldsUpdated.push('estimatedHours');
            previousValues.estimatedHours = currentData.estimatedHours;
            newValues.estimatedHours = requestDto.estimatedHours;
        }
        if (requestDto.storyPoints !== undefined &&
            requestDto.storyPoints !== currentData.storyPoints) {
            fieldsUpdated.push('storyPoints');
            previousValues.storyPoints = currentData.storyPoints;
            newValues.storyPoints = requestDto.storyPoints;
        }
        if (requestDto.dueDate && requestDto.dueDate !== currentData.dueDate) {
            fieldsUpdated.push('dueDate');
            previousValues.dueDate = currentData.dueDate;
            newValues.dueDate = requestDto.dueDate;
        }
        if (requestDto.customFields &&
            JSON.stringify(requestDto.customFields) !==
                JSON.stringify(currentData.customFields)) {
            fieldsUpdated.push('customFields');
            previousValues.customFields = currentData.customFields;
            newValues.customFields = requestDto.customFields;
        }
        return {
            fieldsUpdated,
            previousValues,
            newValues,
            updateReason: requestDto.updateComment,
            updatedBy: requestDto.updatedBy,
            updatedAt: new Date(),
        };
    }
    applyUpdates(currentTask, requestDto) {
        const currentData = currentTask.context?.taskData || {
            title: currentTask.taskTitle,
            priority: update_task_details_request_dto_1.TaskPriority.MEDIUM,
            type: update_task_details_request_dto_1.TaskType.TASK,
        };
        return {
            title: requestDto.title || currentData.title,
            description: requestDto.description || currentData.description,
            priority: requestDto.priority || currentData.priority,
            type: requestDto.type || currentData.type,
            assignee: requestDto.assignee || currentData.assignee,
            reporter: requestDto.reporter || currentData.reporter,
            labels: requestDto.labels || currentData.labels,
            estimatedHours: requestDto.estimatedHours !== undefined
                ? requestDto.estimatedHours
                : currentData.estimatedHours,
            storyPoints: requestDto.storyPoints !== undefined
                ? requestDto.storyPoints
                : currentData.storyPoints,
            dueDate: requestDto.dueDate || currentData.dueDate,
            customFields: requestDto.customFields || currentData.customFields,
        };
    }
    async getTaskVersion(taskId) {
        const updateCount = await this.taskHistoryRepository.count({
            where: {
                taskId,
                action: 'task_updated',
            },
        });
        return updateCount;
    }
};
exports.UpdateTaskDetailsService = UpdateTaskDetailsService;
exports.UpdateTaskDetailsService = UpdateTaskDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateTaskDetailsService);
//# sourceMappingURL=update-task-details.service.js.map