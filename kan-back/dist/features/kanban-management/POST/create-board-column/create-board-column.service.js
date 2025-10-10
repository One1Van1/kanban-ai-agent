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
exports.CreateBoardColumnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const create_board_column_request_dto_1 = require("./create-board-column.request.dto");
const uuid_1 = require("uuid");
let CreateBoardColumnService = class CreateBoardColumnService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async createColumn(requestDto) {
        const { boardId, name, type, position, description, color, wipLimit, createdBy, } = requestDto;
        await this.validateBoardAndPosition(boardId, position, name);
        const columnId = `col-${(0, uuid_1.v4)()}`;
        const adjacentColumns = await this.getAdjacentColumns(boardId, position);
        const columnMetadata = {
            boardId,
            totalColumns: (await this.getTotalColumnsInBoard(boardId)) + 1,
            columnInsertedAt: position,
            adjacentColumns,
        };
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId: columnId,
            taskKey: `BOARD-${boardId}-COL-${position}`,
            taskTitle: `Created column: ${name}`,
            action: 'column_created',
            fromStatus: undefined,
            toStatus: 'active',
            fromColumn: undefined,
            toColumn: name,
            status: 'completed',
            context: {
                columnData: {
                    columnId,
                    boardId,
                    name,
                    type,
                    position,
                    description,
                    color,
                    wipLimit,
                },
                ...columnMetadata,
            },
            agentResponse: {
                success: true,
                columnCreated: true,
                columnId,
                timestamp: new Date().toISOString(),
            },
        });
        const savedLog = await this.taskHistoryRepository.save(historyLog);
        return {
            columnId,
            boardId,
            name,
            type,
            position,
            description,
            color,
            wipLimit,
            createdBy,
            createdAt: savedLog.createdAt,
            success: true,
            totalColumnsInBoard: columnMetadata.totalColumns,
            adjacentColumns: columnMetadata.adjacentColumns,
            historyLogId: savedLog.id,
        };
    }
    async validateBoardAndPosition(boardId, position, columnName) {
        const boardExists = await this.taskHistoryRepository.findOne({
            where: { taskKey: `%BOARD-${boardId}%` },
        });
        const existingColumns = await this.getExistingColumns(boardId);
        if (position < 0 || position > existingColumns.length) {
            throw new common_1.BadRequestException(`Invalid position ${position}. Must be between 0 and ${existingColumns.length}`);
        }
        const duplicateColumn = existingColumns.find((col) => col.name.toLowerCase() === columnName.toLowerCase());
        if (duplicateColumn) {
            throw new common_1.ConflictException(`Column with name "${columnName}" already exists in board ${boardId}`);
        }
        if (existingColumns.length >= 20) {
            throw new common_1.BadRequestException(`Maximum number of columns (20) reached for board ${boardId}`);
        }
    }
    async getExistingColumns(boardId) {
        const columnLogs = await this.taskHistoryRepository.find({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
            order: { createdAt: 'ASC' },
        });
        return columnLogs.map((log) => ({
            id: log.taskId,
            name: log.toColumn || 'Unknown',
            position: log.context?.columnData?.position || 0,
            type: log.context?.columnData?.type || create_board_column_request_dto_1.ColumnType.CUSTOM,
        }));
    }
    async getAdjacentColumns(boardId, position) {
        const existingColumns = await this.getExistingColumns(boardId);
        existingColumns.sort((a, b) => a.position - b.position);
        const adjacentColumns = {};
        const beforeColumn = existingColumns.find((col) => col.position === position - 1);
        const afterColumn = existingColumns.find((col) => col.position === position);
        if (beforeColumn) {
            adjacentColumns.before = beforeColumn.name;
        }
        if (afterColumn) {
            adjacentColumns.after = afterColumn.name;
        }
        return adjacentColumns;
    }
    async getTotalColumnsInBoard(boardId) {
        const columnCount = await this.taskHistoryRepository.count({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
        });
        return columnCount;
    }
    async getAvailableColumnTypes() {
        return Object.values(create_board_column_request_dto_1.ColumnType);
    }
    async validateColumnName(boardId, name) {
        const existingColumns = await this.getExistingColumns(boardId);
        return !existingColumns.some((col) => col.name.toLowerCase() === name.toLowerCase());
    }
};
exports.CreateBoardColumnService = CreateBoardColumnService;
exports.CreateBoardColumnService = CreateBoardColumnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CreateBoardColumnService);
//# sourceMappingURL=create-board-column.service.js.map