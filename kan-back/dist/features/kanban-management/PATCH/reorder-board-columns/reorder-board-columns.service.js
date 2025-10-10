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
exports.ReorderBoardColumnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let ReorderBoardColumnsService = class ReorderBoardColumnsService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(requestDto) {
        await this.validateBoardExists(requestDto.boardId);
        const currentColumns = await this.getCurrentBoardColumns(requestDto.boardId);
        this.validateReorderRequest(requestDto, currentColumns);
        const reorderedColumns = this.calculatePositionChanges(requestDto.columnOrder, currentColumns);
        const historyEntry = await this.createReorderHistoryLog(requestDto, reorderedColumns, currentColumns);
        const userName = await this.getUserDisplayName(requestDto.userId);
        const columnsChanged = reorderedColumns.filter((col) => col.positionChanged).length;
        const boardLayout = this.buildBoardLayout(requestDto.boardId, reorderedColumns);
        const changesSummary = this.generateChangesSummary(reorderedColumns);
        return {
            boardId: requestDto.boardId,
            userId: requestDto.userId,
            userName,
            reorderedAt: historyEntry.createdAt,
            reorderReason: requestDto.reorderReason,
            columnsChanged,
            boardLayout,
            success: true,
            historyLogId: historyEntry.id,
            changesSummary,
            previousOrder: currentColumns.map((_, index) => index),
            newOrder: reorderedColumns.map((col) => col.newPosition),
        };
    }
    async validateBoardExists(boardId) {
        const boardRecord = await this.taskHistoryRepository.findOne({
            where: {
                action: 'BOARD_CREATED',
                context: {
                    boardId,
                },
            },
        });
        if (!boardRecord) {
            throw new common_1.NotFoundException(`Board with ID ${boardId} not found`);
        }
    }
    async getCurrentBoardColumns(boardId) {
        const columnRecords = await this.taskHistoryRepository.find({
            where: {
                action: 'COLUMN_CREATED',
                context: {
                    boardId,
                },
            },
            order: { createdAt: 'ASC' },
        });
        return columnRecords.map((record, index) => ({
            columnId: record.context?.columnId || `col-${index}`,
            columnName: record.context?.columnName || `Column ${index + 1}`,
            position: record.context?.position ?? index,
            createdAt: record.createdAt,
        }));
    }
    validateReorderRequest(requestDto, currentColumns) {
        const { columnOrder, validateComplete } = requestDto;
        const positions = columnOrder.map((col) => col.position);
        const uniquePositions = new Set(positions);
        if (positions.length !== uniquePositions.size) {
            throw new common_1.BadRequestException('Duplicate positions found in column order');
        }
        const maxPosition = Math.max(...positions);
        const minPosition = Math.min(...positions);
        if (minPosition < 0 || maxPosition >= columnOrder.length) {
            throw new common_1.BadRequestException(`Invalid position range. Positions must be between 0 and ${columnOrder.length - 1}`);
        }
        for (const orderItem of columnOrder) {
            const columnExists = currentColumns.some((col) => col.columnId === orderItem.columnId);
            if (!columnExists) {
                throw new common_1.BadRequestException(`Column ${orderItem.columnId} not found on board`);
            }
        }
        if (validateComplete && columnOrder.length !== currentColumns.length) {
            throw new common_1.BadRequestException(`All columns must be included. Expected ${currentColumns.length}, got ${columnOrder.length}`);
        }
    }
    calculatePositionChanges(newOrder, currentColumns) {
        return newOrder.map((orderItem) => {
            const currentColumn = currentColumns.find((col) => col.columnId === orderItem.columnId);
            const previousPosition = currentColumn?.position ?? -1;
            const newPosition = orderItem.position;
            return {
                columnId: orderItem.columnId,
                columnName: orderItem.columnName || currentColumn?.columnName || 'Unknown Column',
                previousPosition,
                newPosition,
                positionChanged: previousPosition !== newPosition,
            };
        });
    }
    async createReorderHistoryLog(requestDto, reorderedColumns, currentColumns) {
        const historyEntry = this.taskHistoryRepository.create({
            agentId: requestDto.userId,
            taskId: `board-reorder-${Date.now()}`,
            taskKey: `BOARD-REORDER-${requestDto.boardId.slice(-8)}`,
            taskTitle: 'Board Columns Reordered',
            action: 'BOARD_COLUMNS_REORDERED',
            context: {
                operation: 'reorder_board_columns',
                boardId: requestDto.boardId,
                reorderReason: requestDto.reorderReason,
                columnsChanged: reorderedColumns.filter((col) => col.positionChanged)
                    .length,
                previousOrder: currentColumns.map((col) => ({
                    columnId: col.columnId,
                    position: col.position,
                })),
                newOrder: reorderedColumns.map((col) => ({
                    columnId: col.columnId,
                    position: col.newPosition,
                })),
                reorderedColumns,
            },
            status: 'completed',
        });
        return await this.taskHistoryRepository.save(historyEntry);
    }
    async getUserDisplayName(userId) {
        if (userId.startsWith('user-')) {
            return `User ${userId.slice(-8)}`;
        }
        return `User ${userId.substring(0, 8)}`;
    }
    buildBoardLayout(boardId, reorderedColumns) {
        const sortedColumns = [...reorderedColumns].sort((a, b) => a.newPosition - b.newPosition);
        return {
            boardId,
            boardName: `Kanban Board ${boardId.slice(-8)}`,
            totalColumns: reorderedColumns.length,
            columns: sortedColumns,
        };
    }
    generateChangesSummary(reorderedColumns) {
        const changedColumns = reorderedColumns.filter((col) => col.positionChanged);
        if (changedColumns.length === 0) {
            return 'No position changes were made';
        }
        const changes = changedColumns.map((col) => `"${col.columnName}" from position ${col.previousPosition} to ${col.newPosition}`);
        return `Reordered ${reorderedColumns.length} columns: moved ${changes.join(', ')}`;
    }
};
exports.ReorderBoardColumnsService = ReorderBoardColumnsService;
exports.ReorderBoardColumnsService = ReorderBoardColumnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReorderBoardColumnsService);
//# sourceMappingURL=reorder-board-columns.service.js.map