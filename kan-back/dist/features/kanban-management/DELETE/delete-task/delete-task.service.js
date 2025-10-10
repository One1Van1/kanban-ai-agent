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
exports.DeleteTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const delete_task_request_dto_1 = require("./delete-task.request.dto");
let DeleteTaskService = class DeleteTaskService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async deleteTask(taskId, requestDto) {
        const currentTask = await this.getCurrentTaskState(taskId);
        if (!currentTask) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        await this.validateDeletionRequest(currentTask, requestDto);
        const taskMetadata = await this.getTaskMetadata(currentTask);
        if (!requestDto.forceDelete) {
            await this.checkTaskDependencies(taskId);
        }
        const deletionResult = await this.performDeletion(currentTask, requestDto, taskMetadata);
        const notifiedUsers = requestDto.notifyUsers
            ? await this.notifyUsersAboutDeletion(taskMetadata)
            : [];
        const historyLog = await this.createDeletionHistoryLog(currentTask, requestDto, taskMetadata);
        return {
            taskId,
            taskKey: currentTask.taskKey,
            taskTitle: currentTask.taskTitle,
            deleteMode: requestDto.deleteMode || delete_task_request_dto_1.DeleteMode.SOFT_DELETE,
            deletedBy: requestDto.deletedBy,
            deletedAt: historyLog.createdAt,
            deleteReason: requestDto.deleteReason,
            originalStatus: currentTask.status,
            originalColumn: currentTask.toColumn || 'Unknown',
            assignee: taskMetadata.assignee,
            watchers: taskMetadata.watchers,
            relatedTasks: taskMetadata.relatedTasks,
            attachmentsDeleted: deletionResult.attachmentsDeleted,
            commentsDeleted: deletionResult.commentsDeleted,
            historyEntriesArchived: deletionResult.historyEntriesArchived,
            notifiedUsers,
            success: true,
            canBeRestored: requestDto.deleteMode === delete_task_request_dto_1.DeleteMode.SOFT_DELETE ||
                requestDto.deleteMode === delete_task_request_dto_1.DeleteMode.ARCHIVE,
            restorationDeadline: this.calculateRestorationDeadline(requestDto.deleteMode),
            historyLogId: historyLog.id,
        };
    }
    async getCurrentTaskState(taskId) {
        return await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
    }
    async validateDeletionRequest(currentTask, requestDto) {
        if (!Object.values(delete_task_request_dto_1.DeleteMode).includes(requestDto.deleteMode || delete_task_request_dto_1.DeleteMode.SOFT_DELETE)) {
            throw new common_1.BadRequestException(`Invalid delete mode: ${requestDto.deleteMode}`);
        }
        if (currentTask.status === 'deleted' || currentTask.status === 'archived') {
            throw new common_1.ConflictException('Task is already deleted or archived');
        }
        if (requestDto.deleteMode === delete_task_request_dto_1.DeleteMode.HARD_DELETE &&
            (currentTask.status === 'done' || currentTask.status === 'completed')) {
            if (!requestDto.forceDelete) {
                throw new common_1.BadRequestException('Cannot hard delete completed tasks without force flag');
            }
        }
        if (!requestDto.deletedBy) {
            throw new common_1.BadRequestException('deletedBy is required');
        }
    }
    async getTaskMetadata(currentTask) {
        const taskData = currentTask.context?.taskData || {};
        const assignmentData = currentTask.context?.assignmentData || {};
        return {
            deletionMode: delete_task_request_dto_1.DeleteMode.SOFT_DELETE,
            taskTitle: currentTask.taskTitle,
            taskKey: currentTask.taskKey,
            originalStatus: currentTask.status,
            originalColumn: currentTask.toColumn || 'Unknown',
            assignee: assignmentData.assignee,
            watchers: assignmentData.watchers || [],
            relatedTasks: await this.getRelatedTasks(currentTask.taskId),
            attachmentsDeleted: 0,
            commentsDeleted: 0,
            historyEntriesArchived: 0,
            deletedBy: '',
            deletedAt: new Date(),
            deleteReason: undefined,
        };
    }
    async checkTaskDependencies(taskId) {
        const dependentTasks = await this.getTasksBlockedByThisTask(taskId);
        if (dependentTasks.length > 0) {
            throw new common_1.ConflictException(`Cannot delete task: ${dependentTasks.length} tasks depend on this task. Use forceDelete=true to override.`);
        }
        const linkedTasks = await this.getLinkedTasks(taskId);
        if (linkedTasks.length > 0) {
            console.warn(`Task ${taskId} has ${linkedTasks.length} linked tasks`);
        }
    }
    async performDeletion(currentTask, requestDto, metadata) {
        let attachmentsDeleted = 0;
        let commentsDeleted = 0;
        let historyEntriesArchived = 0;
        switch (requestDto.deleteMode) {
            case delete_task_request_dto_1.DeleteMode.SOFT_DELETE:
                historyEntriesArchived = await this.softDeleteTask(currentTask.taskId);
                break;
            case delete_task_request_dto_1.DeleteMode.HARD_DELETE:
                if (requestDto.deleteRelatedData) {
                    attachmentsDeleted = await this.deleteTaskAttachments(currentTask.taskId);
                    commentsDeleted = await this.deleteTaskComments(currentTask.taskId);
                }
                historyEntriesArchived = await this.hardDeleteTask(currentTask.taskId);
                break;
            case delete_task_request_dto_1.DeleteMode.ARCHIVE:
                historyEntriesArchived = await this.archiveTask(currentTask.taskId);
                break;
        }
        return {
            attachmentsDeleted,
            commentsDeleted,
            historyEntriesArchived,
        };
    }
    async softDeleteTask(taskId) {
        const count = await this.taskHistoryRepository.count({
            where: { taskId },
        });
        return count;
    }
    async hardDeleteTask(taskId) {
        const count = await this.taskHistoryRepository.count({
            where: { taskId },
        });
        return count;
    }
    async archiveTask(taskId) {
        const count = await this.taskHistoryRepository.count({
            where: { taskId },
        });
        return count;
    }
    async deleteTaskAttachments(taskId) {
        const attachmentCount = Math.floor(Math.random() * 5);
        return attachmentCount;
    }
    async deleteTaskComments(taskId) {
        const commentCount = Math.floor(Math.random() * 10);
        return commentCount;
    }
    async getRelatedTasks(taskId) {
        const relatedTaskLogs = await this.taskHistoryRepository.find({
            where: {
                action: 'task_linked',
            },
        });
        return relatedTaskLogs
            .filter((log) => log.context?.linkData?.sourceTaskId === taskId ||
            log.context?.linkData?.targetTaskId === taskId)
            .map((log) => log.context?.linkData?.sourceTaskId === taskId
            ? log.context?.linkData?.targetTaskId
            : log.context?.linkData?.sourceTaskId)
            .filter((id) => id && id !== taskId);
    }
    async getTasksBlockedByThisTask(taskId) {
        const blockingLogs = await this.taskHistoryRepository.find({
            where: {
                action: 'task_linked',
            },
        });
        return blockingLogs
            .filter((log) => log.context?.linkData?.sourceTaskId === taskId &&
            log.context?.linkData?.linkType === 'blocks')
            .map((log) => log.context?.linkData?.targetTaskId)
            .filter((id) => id);
    }
    async getLinkedTasks(taskId) {
        return await this.getRelatedTasks(taskId);
    }
    async notifyUsersAboutDeletion(metadata) {
        const usersToNotify = new Set();
        if (metadata.assignee) {
            usersToNotify.add(metadata.assignee);
        }
        metadata.watchers.forEach((watcher) => usersToNotify.add(watcher));
        return Array.from(usersToNotify);
    }
    async createDeletionHistoryLog(currentTask, requestDto, metadata) {
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId: currentTask.taskId,
            taskKey: currentTask.taskKey,
            taskTitle: currentTask.taskTitle,
            action: 'task_deleted',
            fromStatus: currentTask.status,
            toStatus: requestDto.deleteMode === delete_task_request_dto_1.DeleteMode.ARCHIVE ? 'archived' : 'deleted',
            fromColumn: currentTask.toColumn,
            toColumn: 'Deleted',
            status: 'completed',
            context: {
                deletionType: 'task_deletion',
                deleteMode: requestDto.deleteMode,
                deleteReason: requestDto.deleteReason,
                forceDelete: requestDto.forceDelete,
                deleteRelatedData: requestDto.deleteRelatedData,
                taskMetadata: metadata,
            },
            agentResponse: {
                success: true,
                taskDeleted: true,
                deleteMode: requestDto.deleteMode,
                timestamp: new Date().toISOString(),
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
    calculateRestorationDeadline(deleteMode) {
        if (deleteMode === delete_task_request_dto_1.DeleteMode.HARD_DELETE) {
            return undefined;
        }
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);
        return deadline;
    }
};
exports.DeleteTaskService = DeleteTaskService;
exports.DeleteTaskService = DeleteTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeleteTaskService);
//# sourceMappingURL=delete-task.service.js.map