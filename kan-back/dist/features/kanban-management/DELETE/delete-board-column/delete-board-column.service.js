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
exports.DeleteBoardColumnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const delete_board_column_request_dto_1 = require("./delete-board-column.request.dto");
let DeleteBoardColumnService = class DeleteBoardColumnService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async deleteColumn(columnId, requestDto) {
        const currentColumn = await this.getCurrentColumnState(columnId);
        if (!currentColumn) {
            throw new common_1.NotFoundException(`Column with ID ${columnId} not found`);
        }
        await this.validateDeletionRequest(currentColumn, requestDto);
        const columnMetadata = await this.getColumnMetadata(currentColumn);
        const tasksInColumn = await this.getTasksInColumn(columnId);
        if (tasksInColumn.length > 0 &&
            !requestDto.forceDelete &&
            requestDto.deleteMode !== delete_board_column_request_dto_1.ColumnDeleteMode.MERGE_WITH_ANOTHER) {
            throw new common_1.ConflictException(`Cannot delete column: ${tasksInColumn.length} tasks are in this column. Use forceDelete=true or merge with another column.`);
        }
        const deletionResult = await this.performColumnDeletion(currentColumn, requestDto, tasksInColumn);
        const notifiedUsers = requestDto.notifyUsers
            ? await this.notifyUsersAboutDeletion(tasksInColumn)
            : [];
        const historyLog = await this.createDeletionHistoryLog(currentColumn, requestDto, deletionResult);
        return {
            columnId,
            boardId: columnMetadata.boardId,
            columnName: columnMetadata.columnName,
            deleteMode: requestDto.deleteMode || delete_board_column_request_dto_1.ColumnDeleteMode.SOFT_DELETE,
            deletedBy: requestDto.deletedBy,
            deletedAt: historyLog.createdAt,
            deleteReason: requestDto.deleteReason,
            originalPosition: columnMetadata.position,
            tasksInColumn: deletionResult.tasksInColumn,
            tasksRelocated: deletionResult.tasksRelocated,
            targetColumnId: requestDto.targetColumnId,
            targetColumnName: deletionResult.targetColumnName,
            positionAdjustments: deletionResult.positionAdjustments,
            notifiedUsers,
            success: true,
            canBeRestored: requestDto.deleteMode === delete_board_column_request_dto_1.ColumnDeleteMode.SOFT_DELETE,
            remainingColumnsInBoard: await this.getRemainingColumnsCount(columnMetadata.boardId),
            historyLogId: historyLog.id,
        };
    }
    async getCurrentColumnState(columnId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                taskId: columnId,
                action: 'column_created',
            },
            order: { createdAt: 'DESC' },
        });
    }
    async validateDeletionRequest(currentColumn, requestDto) {
        if (!Object.values(delete_board_column_request_dto_1.ColumnDeleteMode).includes(requestDto.deleteMode || delete_board_column_request_dto_1.ColumnDeleteMode.SOFT_DELETE)) {
            throw new common_1.BadRequestException(`Invalid delete mode: ${requestDto.deleteMode}`);
        }
        if (requestDto.deleteMode === delete_board_column_request_dto_1.ColumnDeleteMode.MERGE_WITH_ANOTHER) {
            if (!requestDto.targetColumnId) {
                throw new common_1.BadRequestException('targetColumnId is required when merging with another column');
            }
            const targetColumn = await this.getCurrentColumnState(requestDto.targetColumnId);
            if (!targetColumn) {
                throw new common_1.NotFoundException(`Target column with ID ${requestDto.targetColumnId} not found`);
            }
            if (requestDto.targetColumnId === currentColumn.taskId) {
                throw new common_1.BadRequestException('Cannot merge column with itself');
            }
        }
        const boardId = currentColumn.context?.columnData?.boardId;
        const remainingColumns = await this.getActiveColumnsInBoard(boardId);
        if (remainingColumns.length <= 1) {
            throw new common_1.ConflictException('Cannot delete the last column in the board');
        }
    }
    async getColumnMetadata(currentColumn) {
        const columnData = currentColumn.context?.columnData || {};
        return {
            columnName: columnData.name || currentColumn.toColumn || 'Unknown',
            columnType: columnData.type || 'custom',
            position: columnData.position || 0,
            boardId: columnData.boardId || 'unknown',
            tasksInColumn: 0,
            tasksRelocated: 0,
            positionAdjustments: [],
        };
    }
    async getTasksInColumn(columnId) {
        return await this.taskHistoryRepository.find({
            where: {
                toColumn: columnId,
                status: 'completed',
            },
            order: { createdAt: 'DESC' },
        });
    }
    async getActiveColumnsInBoard(boardId) {
        return await this.taskHistoryRepository.find({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
            order: { createdAt: 'ASC' },
        });
    }
    async performColumnDeletion(currentColumn, requestDto, tasksInColumn) {
        const tasksCount = tasksInColumn.length;
        let tasksRelocated = 0;
        let targetColumnName;
        const positionAdjustments = [];
        switch (requestDto.deleteMode) {
            case delete_board_column_request_dto_1.ColumnDeleteMode.SOFT_DELETE:
                break;
            case delete_board_column_request_dto_1.ColumnDeleteMode.HARD_DELETE:
                if (requestDto.forceDelete && tasksCount > 0) {
                    tasksRelocated = tasksCount;
                }
                break;
            case delete_board_column_request_dto_1.ColumnDeleteMode.MERGE_WITH_ANOTHER:
                if (requestDto.targetColumnId) {
                    const targetColumn = await this.getCurrentColumnState(requestDto.targetColumnId);
                    targetColumnName =
                        targetColumn?.context?.columnData?.name || 'Unknown';
                    tasksRelocated = tasksCount;
                }
                break;
        }
        const columnData = currentColumn.context?.columnData;
        if (columnData?.position !== undefined) {
            positionAdjustments.push(...(await this.adjustColumnPositions(columnData.boardId, columnData.position)));
        }
        return {
            tasksInColumn: tasksCount,
            tasksRelocated,
            targetColumnName,
            positionAdjustments,
        };
    }
    async adjustColumnPositions(boardId, deletedPosition) {
        const columnsToAdjust = await this.taskHistoryRepository.find({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
        });
        return columnsToAdjust
            .filter((col) => {
            const pos = col.context?.columnData?.position;
            return pos !== undefined && pos > deletedPosition;
        })
            .map((col) => ({
            columnId: col.taskId,
            oldPosition: col.context?.columnData?.position,
            newPosition: col.context?.columnData?.position - 1,
        }));
    }
    async notifyUsersAboutDeletion(tasksInColumn) {
        const usersToNotify = new Set();
        tasksInColumn.forEach((task) => {
            const assignmentData = task.context?.assignmentData;
            if (assignmentData?.assignee) {
                usersToNotify.add(assignmentData.assignee);
            }
            if (assignmentData?.watchers) {
                assignmentData.watchers.forEach((watcher) => usersToNotify.add(watcher));
            }
        });
        return Array.from(usersToNotify);
    }
    async createDeletionHistoryLog(currentColumn, requestDto, deletionResult) {
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId: currentColumn.taskId,
            taskKey: currentColumn.taskKey,
            taskTitle: `Deleted column: ${currentColumn.context?.columnData?.name || 'Unknown'}`,
            action: 'column_deleted',
            fromStatus: 'active',
            toStatus: requestDto.deleteMode === delete_board_column_request_dto_1.ColumnDeleteMode.SOFT_DELETE
                ? 'deleted'
                : 'removed',
            fromColumn: currentColumn.context?.columnData?.name,
            toColumn: 'Deleted',
            status: 'completed',
            context: {
                deletionType: 'column_deletion',
                deleteMode: requestDto.deleteMode,
                deleteReason: requestDto.deleteReason,
                forceDelete: requestDto.forceDelete,
                targetColumnId: requestDto.targetColumnId,
                columnMetadata: currentColumn.context?.columnData,
                deletionResult,
            },
            agentResponse: {
                success: true,
                columnDeleted: true,
                deleteMode: requestDto.deleteMode,
                timestamp: new Date().toISOString(),
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
    async getRemainingColumnsCount(boardId) {
        return ((await this.taskHistoryRepository.count({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
        })) - 1);
    }
};
exports.DeleteBoardColumnService = DeleteBoardColumnService;
exports.DeleteBoardColumnService = DeleteBoardColumnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeleteBoardColumnService);
//# sourceMappingURL=delete-board-column.service.js.map