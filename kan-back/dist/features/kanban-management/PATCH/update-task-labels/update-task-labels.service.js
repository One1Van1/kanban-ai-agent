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
exports.UpdateTaskLabelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const update_task_labels_request_dto_1 = require("./update-task-labels.request.dto");
let UpdateTaskLabelsService = class UpdateTaskLabelsService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, requestDto) {
        const task = await this.validateTaskExists(taskId);
        const currentLabels = await this.getCurrentTaskLabels(taskId);
        const { updatedLabels, addedLabels, removedLabels, labelChanges } = this.processLabelOperation(currentLabels, requestDto);
        const historyLog = await this.createLabelsHistoryLog(taskId, task, requestDto, addedLabels, removedLabels);
        return {
            taskId,
            operation: requestDto.operation,
            currentLabels: updatedLabels,
            addedLabels,
            removedLabels,
            totalLabelsCount: updatedLabels.length,
            updatedAt: historyLog.createdAt,
            updatedBy: requestDto.updatedBy,
            updateReason: requestDto.updateReason,
            success: true,
            labelChanges,
            historyLogId: historyLog.id,
        };
    }
    async validateTaskExists(taskId) {
        const task = await this.taskHistoryRepository.findOne({
            where: {
                taskId,
                action: 'task_created',
            },
            order: { createdAt: 'DESC' },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        return task;
    }
    async getCurrentTaskLabels(taskId) {
        const labelRecord = await this.taskHistoryRepository.findOne({
            where: [
                { taskId, action: 'labels_updated' },
                { taskId, action: 'task_created' },
            ],
            order: { createdAt: 'DESC' },
        });
        if (!labelRecord) {
            return [];
        }
        const labels = labelRecord.context?.taskData?.labels ||
            labelRecord.agentResponse?.labels ||
            [];
        return Array.isArray(labels) ? labels : [];
    }
    processLabelOperation(currentLabels, requestDto) {
        let updatedLabels = [...currentLabels];
        let addedLabels = [];
        let removedLabels = [];
        const labelChanges = [];
        const timestamp = new Date();
        switch (requestDto.operation) {
            case update_task_labels_request_dto_1.LabelOperation.ADD:
                for (const label of requestDto.labels) {
                    if (!updatedLabels.includes(label)) {
                        updatedLabels.push(label);
                        addedLabels.push(label);
                        labelChanges.push({
                            labelName: label,
                            operation: 'added',
                            timestamp,
                        });
                    }
                }
                break;
            case update_task_labels_request_dto_1.LabelOperation.REMOVE:
                for (const label of requestDto.labels) {
                    const index = updatedLabels.indexOf(label);
                    if (index > -1) {
                        updatedLabels.splice(index, 1);
                        removedLabels.push(label);
                        labelChanges.push({
                            labelName: label,
                            operation: 'removed',
                            timestamp,
                        });
                    }
                }
                break;
            case update_task_labels_request_dto_1.LabelOperation.REPLACE:
                removedLabels = currentLabels.filter((label) => !requestDto.labels.includes(label));
                addedLabels = requestDto.labels.filter((label) => !currentLabels.includes(label));
                updatedLabels = [...requestDto.labels];
                removedLabels.forEach((label) => {
                    labelChanges.push({
                        labelName: label,
                        operation: 'removed',
                        timestamp,
                    });
                });
                addedLabels.forEach((label) => {
                    labelChanges.push({
                        labelName: label,
                        operation: 'added',
                        timestamp,
                    });
                });
                break;
        }
        return {
            updatedLabels: updatedLabels.sort(),
            addedLabels,
            removedLabels,
            labelChanges,
        };
    }
    async createLabelsHistoryLog(taskId, task, requestDto, addedLabels, removedLabels) {
        const historyLog = this.taskHistoryRepository.create({
            agentId: requestDto.updatedBy || 'system',
            taskId,
            taskKey: task.taskKey,
            taskTitle: `Updated labels: ${task.taskTitle}`,
            action: 'labels_updated',
            fromStatus: task.fromStatus || task.toStatus,
            toStatus: task.toStatus,
            fromColumn: task.fromColumn || task.toColumn,
            toColumn: task.toColumn,
            status: 'completed',
            context: {
                labelOperation: requestDto.operation,
                labelsToApply: requestDto.labels,
                addedLabels,
                removedLabels,
                updateReason: requestDto.updateReason,
                taskData: {
                    labels: requestDto.labels,
                },
            },
            agentResponse: {
                success: true,
                labelsUpdated: true,
                operation: requestDto.operation,
                addedCount: addedLabels.length,
                removedCount: removedLabels.length,
                timestamp: new Date().toISOString(),
                labels: requestDto.labels,
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
};
exports.UpdateTaskLabelsService = UpdateTaskLabelsService;
exports.UpdateTaskLabelsService = UpdateTaskLabelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateTaskLabelsService);
//# sourceMappingURL=update-task-labels.service.js.map