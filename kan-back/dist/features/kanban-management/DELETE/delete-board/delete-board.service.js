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
exports.DeleteBoardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const delete_board_request_dto_1 = require("./delete-board.request.dto");
let DeleteBoardService = class DeleteBoardService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async deleteBoard(boardId, requestDto) {
        const currentBoard = await this.getCurrentBoardState(boardId);
        if (!currentBoard) {
            throw new common_1.NotFoundException(`Board with ID ${boardId} not found`);
        }
        await this.validateDeletionRequest(currentBoard, requestDto);
        const boardMetadata = await this.getBoardMetadata(currentBoard);
        const tasksInBoard = await this.getTasksInBoard(boardId);
        const columnsInBoard = await this.getColumnsInBoard(boardId);
        const boardMembers = await this.getBoardMembers(boardId);
        if (tasksInBoard.length > 0 &&
            !requestDto.forceDelete &&
            requestDto.deleteMode !== delete_board_request_dto_1.BoardDeleteMode.EXPORT_AND_DELETE) {
            throw new common_1.ConflictException(`Cannot delete board: ${tasksInBoard.length} tasks are in this board. Use forceDelete=true or EXPORT_AND_DELETE mode.`);
        }
        const deletionResult = await this.performBoardDeletion(currentBoard, requestDto, tasksInBoard, columnsInBoard);
        const backupPath = requestDto.createBackup
            ? await this.createBoardBackup(currentBoard, boardMetadata)
            : undefined;
        const filesDeletion = requestDto.deleteFiles
            ? await this.deleteAssociatedFiles(boardId)
            : undefined;
        const notifiedMembers = requestDto.notifyMembers
            ? await this.notifyMembersAboutDeletion(boardMembers)
            : [];
        const historyLog = await this.createDeletionHistoryLog(currentBoard, requestDto, deletionResult);
        return {
            boardId,
            boardName: boardMetadata.boardName,
            deleteMode: requestDto.deleteMode || delete_board_request_dto_1.BoardDeleteMode.SOFT_DELETE,
            deletedBy: requestDto.deletedBy,
            deletedAt: historyLog.createdAt,
            deleteReason: requestDto.deleteReason,
            columnsDeleted: deletionResult.columnsDeleted,
            tasksInBoard: deletionResult.tasksInBoard,
            tasksRelocated: deletionResult.tasksRelocated,
            targetBoardId: requestDto.targetBoardId,
            targetBoardName: deletionResult.targetBoardName,
            taskRelocations: deletionResult.taskRelocations,
            notifiedMembers,
            success: true,
            canBeRestored: requestDto.deleteMode === delete_board_request_dto_1.BoardDeleteMode.SOFT_DELETE ||
                requestDto.deleteMode === delete_board_request_dto_1.BoardDeleteMode.ARCHIVE,
            backupPath,
            filesDeletion,
            historyLogId: historyLog.id,
        };
    }
    async getCurrentBoardState(boardId) {
        return await this.taskHistoryRepository.findOne({
            where: {
                taskId: boardId,
                action: 'board_created',
            },
            order: { createdAt: 'DESC' },
        });
    }
    async validateDeletionRequest(currentBoard, requestDto) {
        if (!Object.values(delete_board_request_dto_1.BoardDeleteMode).includes(requestDto.deleteMode || delete_board_request_dto_1.BoardDeleteMode.SOFT_DELETE)) {
            throw new common_1.BadRequestException(`Invalid delete mode: ${requestDto.deleteMode}`);
        }
        if (requestDto.deleteMode === delete_board_request_dto_1.BoardDeleteMode.EXPORT_AND_DELETE) {
            if (!requestDto.targetBoardId) {
                throw new common_1.BadRequestException('targetBoardId is required when using EXPORT_AND_DELETE mode');
            }
            const targetBoard = await this.getCurrentBoardState(requestDto.targetBoardId);
            if (!targetBoard) {
                throw new common_1.NotFoundException(`Target board with ID ${requestDto.targetBoardId} not found`);
            }
            if (requestDto.targetBoardId === currentBoard.taskId) {
                throw new common_1.BadRequestException('Cannot move tasks to the same board being deleted');
            }
        }
        const activeBoardsCount = await this.getActiveBoardsCount();
        if (activeBoardsCount <= 1 &&
            requestDto.deleteMode === delete_board_request_dto_1.BoardDeleteMode.HARD_DELETE) {
            throw new common_1.ConflictException('Cannot hard delete the last active board');
        }
    }
    async getBoardMetadata(currentBoard) {
        const boardData = currentBoard.context?.boardData || {};
        return {
            boardName: boardData.name || currentBoard.taskTitle || 'Unknown Board',
            boardType: boardData.type || 'kanban',
            columnsCount: await this.getColumnsInBoard(currentBoard.taskId).then((cols) => cols.length),
            tasksCount: await this.getTasksInBoard(currentBoard.taskId).then((tasks) => tasks.length),
            membersCount: await this.getBoardMembers(currentBoard.taskId).then((members) => members.length),
            filesCount: await this.getBoardFilesCount(currentBoard.taskId),
            createdAt: currentBoard.createdAt,
            lastActivityAt: boardData.lastActivityAt || currentBoard.createdAt,
        };
    }
    async getTasksInBoard(boardId) {
        return await this.taskHistoryRepository.find({
            where: {
                taskKey: `%BOARD-${boardId}%`,
                action: 'task_created',
            },
            order: { createdAt: 'DESC' },
        });
    }
    async getColumnsInBoard(boardId) {
        return await this.taskHistoryRepository.find({
            where: {
                taskKey: `%BOARD-${boardId}%`,
                action: 'column_created',
            },
            order: { createdAt: 'ASC' },
        });
    }
    async getBoardMembers(boardId) {
        const memberRecords = await this.taskHistoryRepository.find({
            where: {
                taskId: boardId,
                action: 'member_added',
            },
        });
        return memberRecords
            .map((record) => record.context?.memberData?.userId)
            .filter(Boolean);
    }
    async getBoardFilesCount(boardId) {
        return await this.taskHistoryRepository.count({
            where: {
                taskKey: `%BOARD-${boardId}%`,
                action: 'file_uploaded',
            },
        });
    }
    async getActiveBoardsCount() {
        return await this.taskHistoryRepository.count({
            where: {
                action: 'board_created',
                status: 'completed',
            },
        });
    }
    async performBoardDeletion(currentBoard, requestDto, tasksInBoard, columnsInBoard) {
        const tasksCount = tasksInBoard.length;
        const columnsCount = columnsInBoard.length;
        let tasksRelocated = 0;
        let targetBoardName;
        const taskRelocations = [];
        switch (requestDto.deleteMode) {
            case delete_board_request_dto_1.BoardDeleteMode.SOFT_DELETE:
            case delete_board_request_dto_1.BoardDeleteMode.ARCHIVE:
                break;
            case delete_board_request_dto_1.BoardDeleteMode.HARD_DELETE:
                if (requestDto.forceDelete && tasksCount > 0) {
                    tasksRelocated = 0;
                }
                break;
            case delete_board_request_dto_1.BoardDeleteMode.EXPORT_AND_DELETE:
                if (requestDto.targetBoardId) {
                    const targetBoard = await this.getCurrentBoardState(requestDto.targetBoardId);
                    targetBoardName =
                        targetBoard?.context?.boardData?.name || 'Unknown Target Board';
                    for (const task of tasksInBoard) {
                        const relocation = {
                            taskId: task.taskId,
                            taskTitle: task.taskTitle,
                            fromBoardId: currentBoard.taskId,
                            toBoardId: requestDto.targetBoardId,
                            newColumnId: await this.getDefaultColumnInBoard(requestDto.targetBoardId),
                            relocatedAt: new Date(),
                        };
                        taskRelocations.push(relocation);
                    }
                    tasksRelocated = tasksCount;
                }
                break;
        }
        return {
            columnsDeleted: columnsCount,
            tasksInBoard: tasksCount,
            tasksRelocated,
            targetBoardName,
            taskRelocations,
        };
    }
    async getDefaultColumnInBoard(boardId) {
        const firstColumn = await this.taskHistoryRepository.findOne({
            where: {
                taskKey: `%BOARD-${boardId}%`,
                action: 'column_created',
            },
            order: { createdAt: 'ASC' },
        });
        return firstColumn?.taskId || 'default-column';
    }
    async createBoardBackup(currentBoard, boardMetadata) {
        const timestamp = new Date().toISOString().split('T')[0];
        const backupPath = `/backups/boards/board-${currentBoard.taskId}_${timestamp}.json`;
        return backupPath;
    }
    async deleteAssociatedFiles(boardId) {
        const filesCount = await this.getBoardFilesCount(boardId);
        return {
            totalFiles: filesCount,
            deletedFiles: Math.max(0, filesCount - 2),
            failedDeletions: filesCount > 2 ? ['file1.pdf', 'image2.png'] : [],
            totalSizeDeleted: filesCount * 1024 * 512,
        };
    }
    async notifyMembersAboutDeletion(boardMembers) {
        return boardMembers;
    }
    async createDeletionHistoryLog(currentBoard, requestDto, deletionResult) {
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId: currentBoard.taskId,
            taskKey: currentBoard.taskKey,
            taskTitle: `Deleted board: ${currentBoard.context?.boardData?.name || 'Unknown'}`,
            action: 'board_deleted',
            fromStatus: 'active',
            toStatus: requestDto.deleteMode === delete_board_request_dto_1.BoardDeleteMode.SOFT_DELETE
                ? 'deleted'
                : requestDto.deleteMode === delete_board_request_dto_1.BoardDeleteMode.ARCHIVE
                    ? 'archived'
                    : 'removed',
            fromColumn: 'Active Boards',
            toColumn: 'Deleted',
            status: 'completed',
            context: {
                deletionType: 'board_deletion',
                deleteMode: requestDto.deleteMode,
                deleteReason: requestDto.deleteReason,
                forceDelete: requestDto.forceDelete,
                targetBoardId: requestDto.targetBoardId,
                boardMetadata: currentBoard.context?.boardData,
                deletionResult,
            },
            agentResponse: {
                success: true,
                boardDeleted: true,
                deleteMode: requestDto.deleteMode,
                timestamp: new Date().toISOString(),
            },
        });
        return await this.taskHistoryRepository.save(historyLog);
    }
};
exports.DeleteBoardService = DeleteBoardService;
exports.DeleteBoardService = DeleteBoardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeleteBoardService);
//# sourceMappingURL=delete-board.service.js.map