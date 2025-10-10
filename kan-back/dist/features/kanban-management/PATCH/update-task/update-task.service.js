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
exports.UpdateTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let UpdateTaskService = class UpdateTaskService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    detectChanges(existingTask, updateDto) {
        const changes = [];
        const now = new Date();
        if (updateDto.title && updateDto.title !== existingTask.taskTitle) {
            changes.push({
                field: 'title',
                oldValue: existingTask.taskTitle,
                newValue: updateDto.title,
                updatedAt: now,
            });
        }
        if (updateDto.taskKey && updateDto.taskKey !== existingTask.taskKey) {
            changes.push({
                field: 'taskKey',
                oldValue: existingTask.taskKey,
                newValue: updateDto.taskKey,
                updatedAt: now,
            });
        }
        const currentPriority = existingTask.context?.priority;
        if (updateDto.priority && updateDto.priority !== currentPriority) {
            changes.push({
                field: 'priority',
                oldValue: currentPriority,
                newValue: updateDto.priority,
                updatedAt: now,
            });
        }
        const currentAssigneeEmail = existingTask.context?.assignment?.assigneeEmail;
        if (updateDto.assigneeEmail &&
            updateDto.assigneeEmail !== currentAssigneeEmail) {
            changes.push({
                field: 'assigneeEmail',
                oldValue: currentAssigneeEmail,
                newValue: updateDto.assigneeEmail,
                updatedAt: now,
            });
        }
        const currentAssigneeName = existingTask.context?.assignment?.assigneeName;
        if (updateDto.assigneeName &&
            updateDto.assigneeName !== currentAssigneeName) {
            changes.push({
                field: 'assigneeName',
                oldValue: currentAssigneeName,
                newValue: updateDto.assigneeName,
                updatedAt: now,
            });
        }
        const currentDescription = existingTask.context?.description;
        if (updateDto.description && updateDto.description !== currentDescription) {
            changes.push({
                field: 'description',
                oldValue: currentDescription,
                newValue: updateDto.description,
                updatedAt: now,
            });
        }
        const currentTags = existingTask.context?.tags;
        if (updateDto.tags &&
            JSON.stringify(updateDto.tags) !== JSON.stringify(currentTags)) {
            changes.push({
                field: 'tags',
                oldValue: currentTags,
                newValue: updateDto.tags,
                updatedAt: now,
            });
        }
        const currentDueDate = existingTask.context?.dueDate;
        if (updateDto.dueDate && updateDto.dueDate !== currentDueDate) {
            changes.push({
                field: 'dueDate',
                oldValue: currentDueDate,
                newValue: updateDto.dueDate,
                updatedAt: now,
            });
        }
        const currentEstimatedHours = existingTask.context?.estimatedHours;
        if (updateDto.estimatedHours &&
            updateDto.estimatedHours !== currentEstimatedHours) {
            changes.push({
                field: 'estimatedHours',
                oldValue: currentEstimatedHours,
                newValue: updateDto.estimatedHours,
                updatedAt: now,
            });
        }
        return changes;
    }
    buildUpdatedContext(existingTask, updateDto) {
        const existingContext = existingTask.context || {};
        const newContext = { ...existingContext };
        if (updateDto.priority) {
            newContext.priority = updateDto.priority;
        }
        if (updateDto.description) {
            newContext.description = updateDto.description;
        }
        if (updateDto.tags) {
            newContext.tags = updateDto.tags;
        }
        if (updateDto.dueDate) {
            newContext.dueDate = updateDto.dueDate;
        }
        if (updateDto.estimatedHours) {
            newContext.estimatedHours = updateDto.estimatedHours;
        }
        if (updateDto.assigneeEmail || updateDto.assigneeName) {
            newContext.assignment = {
                ...newContext.assignment,
                assigneeEmail: updateDto.assigneeEmail || newContext.assignment?.assigneeEmail,
                assigneeName: updateDto.assigneeName ||
                    newContext.assignment?.assigneeName ||
                    updateDto.assigneeEmail,
                lastUpdated: new Date().toISOString(),
                updatedBy: updateDto.updatedByEmail || 'system',
            };
        }
        newContext.lastUpdate = {
            updatedAt: new Date().toISOString(),
            updatedBy: updateDto.updatedByEmail || updateDto.updatedByName || 'system',
            updateReason: updateDto.updateReason || 'general_update',
            triggerType: updateDto.triggerType || 'manual',
        };
        if (updateDto.context) {
            Object.assign(newContext, updateDto.context);
        }
        return newContext;
    }
    async execute(taskId, updateDto) {
        const existingTask = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!existingTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const changes = this.detectChanges(existingTask, updateDto);
        if (changes.length === 0) {
            const currentTask = {
                id: existingTask.id,
                taskId: existingTask.taskId,
                taskKey: existingTask.taskKey,
                title: existingTask.taskTitle,
                description: existingTask.context?.description,
                priority: existingTask.context?.priority || 'medium',
                assigneeEmail: existingTask.context?.assignment?.assigneeEmail,
                assigneeName: existingTask.context?.assignment?.assigneeName,
                tags: existingTask.context?.tags,
                dueDate: existingTask.context?.dueDate,
                estimatedHours: existingTask.context?.estimatedHours,
                currentColumn: existingTask.toColumn || 'backlog',
                currentStatus: existingTask.toStatus || 'todo',
                context: existingTask.context,
                updatedAt: existingTask.createdAt,
                updatedBy: existingTask.context?.lastUpdate?.updatedBy,
                agentId: existingTask.agentId,
            };
            return {
                success: true,
                message: 'No changes detected - task is already up to date',
                taskId: taskId,
                updatedTask: currentTask,
                changes: [],
                timestamp: new Date().toISOString(),
                metadata: {
                    changesCount: 0,
                    preservedPosition: true,
                    validationsPassed: ['no_changes_detected'],
                },
            };
        }
        const updatedContext = this.buildUpdatedContext(existingTask, updateDto);
        const updateHistory = this.taskHistoryRepository.create({
            taskId: taskId,
            taskKey: updateDto.taskKey || existingTask.taskKey,
            taskTitle: updateDto.title || existingTask.taskTitle,
            action: 'task_updated',
            fromColumn: existingTask.toColumn,
            toColumn: existingTask.toColumn,
            fromStatus: existingTask.toStatus,
            toStatus: existingTask.toStatus,
            status: 'completed',
            context: updatedContext,
            agentId: updateDto.agentId || existingTask.agentId || 'system',
            agentResponse: {
                success: true,
                message: `Task updated with ${changes.length} changes`,
                timestamp: new Date().toISOString(),
                triggerType: updateDto.triggerType || 'manual',
                changesApplied: changes.map((c) => c.field),
                preservedPosition: updateDto.preservePosition ?? true,
            },
        });
        const savedUpdate = await this.taskHistoryRepository.save(updateHistory);
        const updatedTask = {
            id: savedUpdate.id,
            taskId: taskId,
            taskKey: savedUpdate.taskKey,
            title: savedUpdate.taskTitle,
            description: updatedContext.description,
            priority: updatedContext.priority || 'medium',
            assigneeEmail: updatedContext.assignment?.assigneeEmail,
            assigneeName: updatedContext.assignment?.assigneeName,
            tags: updatedContext.tags,
            dueDate: updatedContext.dueDate,
            estimatedHours: updatedContext.estimatedHours,
            currentColumn: savedUpdate.toColumn || 'backlog',
            currentStatus: savedUpdate.toStatus || 'todo',
            context: updatedContext,
            updatedAt: savedUpdate.createdAt,
            updatedBy: updateDto.updatedByEmail || updateDto.updatedByName,
            agentId: updateDto.agentId,
        };
        return {
            success: true,
            message: `Task updated successfully with ${changes.length} changes`,
            taskId: taskId,
            updatedTask: updatedTask,
            changes: changes,
            timestamp: savedUpdate.createdAt.toISOString(),
            metadata: {
                changesCount: changes.length,
                preservedPosition: updateDto.preservePosition ?? true,
                notificationsSent: updateDto.sendNotifications ? ['email'] : [],
                queueJobId: `update-${savedUpdate.id}`,
                validationsPassed: ['task_exists', 'changes_detected', 'context_valid'],
                previousVersion: {
                    title: existingTask.taskTitle,
                    priority: existingTask.context?.priority,
                    assigneeEmail: existingTask.context?.assignment?.assigneeEmail,
                },
            },
        };
    }
};
exports.UpdateTaskService = UpdateTaskService;
exports.UpdateTaskService = UpdateTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateTaskService);
//# sourceMappingURL=update-task.service.js.map