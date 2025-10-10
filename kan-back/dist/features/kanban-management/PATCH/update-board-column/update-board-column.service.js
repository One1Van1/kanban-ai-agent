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
exports.UpdateBoardColumnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
const update_board_column_request_dto_1 = require("./update-board-column.request.dto");
let UpdateBoardColumnService = class UpdateBoardColumnService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async updateColumn(columnId, requestDto) {
        const currentColumn = await this.getCurrentColumnState(columnId);
        if (!currentColumn) {
            throw new common_1.NotFoundException(`Column with ID ${columnId} not found`);
        }
        await this.validateUpdateRequest(currentColumn, requestDto);
        const updateMetadata = await this.calculateUpdateMetadata(currentColumn, requestDto);
        if (updateMetadata.fieldsUpdated.length === 0) {
            throw new common_1.BadRequestException('No fields to update provided');
        }
        const updatedColumnData = this.applyUpdates(currentColumn, requestDto);
        const boardId = currentColumn.context?.columnData?.boardId || 'unknown';
        if (requestDto.position !== undefined &&
            requestDto.position !== currentColumn.context?.columnData?.position) {
            await this.handlePositionUpdate(boardId, columnId, requestDto.position, currentColumn.context?.columnData?.position);
        }
        const historyLog = this.taskHistoryRepository.create({
            agentId: 'system',
            taskId: columnId,
            taskKey: `BOARD-${boardId}-COL-UPDATE`,
            taskTitle: `Updated column: ${updatedColumnData.name}`,
            action: 'column_updated',
            fromStatus: 'active',
            toStatus: updatedColumnData.isActive ? 'active' : 'inactive',
            fromColumn: currentColumn.context?.columnData?.name,
            toColumn: updatedColumnData.name,
            status: 'completed',
            context: {
                updateType: 'column_update',
                fieldsUpdated: updateMetadata.fieldsUpdated,
                previousValues: updateMetadata.previousValues,
                newValues: updateMetadata.newValues,
                updateComment: requestDto.updateComment,
                columnData: updatedColumnData,
                positionChanges: updateMetadata.positionChanges,
            },
            agentResponse: {
                success: true,
                updateApplied: true,
                fieldsModified: updateMetadata.fieldsUpdated.length,
                timestamp: new Date().toISOString(),
            },
        });
        const savedLog = await this.taskHistoryRepository.save(historyLog);
        const currentTaskCount = await this.getCurrentTaskCountInColumn(columnId);
        return {
            columnId,
            boardId,
            name: updatedColumnData.name,
            type: updatedColumnData.type,
            position: updatedColumnData.position,
            description: updatedColumnData.description,
            color: updatedColumnData.color,
            wipLimit: updatedColumnData.wipLimit,
            isActive: updatedColumnData.isActive,
            updatedBy: requestDto.updatedBy,
            updatedAt: savedLog.createdAt,
            fieldsUpdated: updateMetadata.fieldsUpdated,
            previousValues: updateMetadata.previousValues,
            positionChanges: updateMetadata.positionChanges,
            updateComment: requestDto.updateComment,
            success: true,
            version: (await this.getColumnVersion(columnId)) + 1,
            currentTaskCount,
            historyLogId: savedLog.id,
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
    async validateUpdateRequest(currentColumn, requestDto) {
        const boardId = currentColumn.context?.columnData?.boardId;
        if (requestDto.type &&
            !Object.values(update_board_column_request_dto_1.ColumnType).includes(requestDto.type)) {
            throw new common_1.BadRequestException(`Invalid column type: ${requestDto.type}`);
        }
        if (requestDto.position !== undefined) {
            const totalColumns = await this.getTotalColumnsInBoard(boardId);
            if (requestDto.position < 0 || requestDto.position >= totalColumns) {
                throw new common_1.BadRequestException(`Invalid position ${requestDto.position}. Must be between 0 and ${totalColumns - 1}`);
            }
        }
        if (requestDto.wipLimit !== undefined && requestDto.wipLimit < 1) {
            throw new common_1.BadRequestException('WIP limit must be at least 1');
        }
        if (requestDto.name) {
            const duplicateColumn = await this.findColumnByNameInBoard(boardId, requestDto.name);
            if (duplicateColumn && duplicateColumn.taskId !== currentColumn.taskId) {
                throw new common_1.ConflictException(`Column with name "${requestDto.name}" already exists in board ${boardId}`);
            }
        }
        if (requestDto.color && !this.isValidHexColor(requestDto.color)) {
            throw new common_1.BadRequestException('Color must be a valid hex color code (e.g., #FF5722)');
        }
    }
    async calculateUpdateMetadata(currentColumn, requestDto) {
        const fieldsUpdated = [];
        const previousValues = {};
        const newValues = {};
        const currentData = currentColumn.context?.columnData || {};
        if (requestDto.name && requestDto.name !== currentData.name) {
            fieldsUpdated.push('name');
            previousValues.name = currentData.name;
            newValues.name = requestDto.name;
        }
        if (requestDto.type && requestDto.type !== currentData.type) {
            fieldsUpdated.push('type');
            previousValues.type = currentData.type;
            newValues.type = requestDto.type;
        }
        if (requestDto.description &&
            requestDto.description !== currentData.description) {
            fieldsUpdated.push('description');
            previousValues.description = currentData.description;
            newValues.description = requestDto.description;
        }
        if (requestDto.color && requestDto.color !== currentData.color) {
            fieldsUpdated.push('color');
            previousValues.color = currentData.color;
            newValues.color = requestDto.color;
        }
        if (requestDto.wipLimit !== undefined &&
            requestDto.wipLimit !== currentData.wipLimit) {
            fieldsUpdated.push('wipLimit');
            previousValues.wipLimit = currentData.wipLimit;
            newValues.wipLimit = requestDto.wipLimit;
        }
        if (requestDto.isActive !== undefined &&
            requestDto.isActive !== currentData.isActive) {
            fieldsUpdated.push('isActive');
            previousValues.isActive = currentData.isActive;
            newValues.isActive = requestDto.isActive;
        }
        let positionChanges;
        if (requestDto.position !== undefined &&
            requestDto.position !== currentData.position) {
            fieldsUpdated.push('position');
            previousValues.position = currentData.position;
            newValues.position = requestDto.position;
            const affectedColumns = await this.getAffectedColumnsByPositionChange(currentData.boardId, currentData.position, requestDto.position);
            positionChanges = {
                from: currentData.position,
                to: requestDto.position,
                affectedColumns,
            };
        }
        return {
            fieldsUpdated,
            previousValues,
            newValues,
            positionChanges,
            updateReason: requestDto.updateComment,
            updatedBy: requestDto.updatedBy,
            updatedAt: new Date(),
        };
    }
    applyUpdates(currentColumn, requestDto) {
        const currentData = currentColumn.context?.columnData || {};
        return {
            name: requestDto.name || currentData.name,
            type: requestDto.type || currentData.type,
            position: requestDto.position !== undefined
                ? requestDto.position
                : currentData.position,
            description: requestDto.description || currentData.description,
            color: requestDto.color || currentData.color,
            wipLimit: requestDto.wipLimit !== undefined
                ? requestDto.wipLimit
                : currentData.wipLimit,
            isActive: requestDto.isActive !== undefined
                ? requestDto.isActive
                : (currentData.isActive ?? true),
            boardId: currentData.boardId,
        };
    }
    async handlePositionUpdate(boardId, columnId, newPosition, oldPosition) {
        console.log(`Column ${columnId} position changed from ${oldPosition} to ${newPosition} in board ${boardId}`);
    }
    async getTotalColumnsInBoard(boardId) {
        return await this.taskHistoryRepository.count({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
        });
    }
    async findColumnByNameInBoard(boardId, name) {
        return await this.taskHistoryRepository.findOne({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
                toColumn: name,
            },
        });
    }
    async getAffectedColumnsByPositionChange(boardId, fromPosition, toPosition) {
        const minPos = Math.min(fromPosition, toPosition);
        const maxPos = Math.max(fromPosition, toPosition);
        const affectedColumns = await this.taskHistoryRepository.find({
            where: {
                action: 'column_created',
                taskKey: `%BOARD-${boardId}%`,
            },
        });
        return affectedColumns
            .filter((col) => {
            const pos = col.context?.columnData?.position;
            return pos >= minPos && pos <= maxPos;
        })
            .map((col) => col.taskId);
    }
    async getCurrentTaskCountInColumn(columnId) {
        return await this.taskHistoryRepository.count({
            where: {
                toColumn: columnId,
                status: 'completed',
            },
        });
    }
    async getColumnVersion(columnId) {
        const updateCount = await this.taskHistoryRepository.count({
            where: {
                taskId: columnId,
                action: 'column_updated',
            },
        });
        return updateCount;
    }
    isValidHexColor(color) {
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexColorRegex.test(color);
    }
};
exports.UpdateBoardColumnService = UpdateBoardColumnService;
exports.UpdateBoardColumnService = UpdateBoardColumnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateBoardColumnService);
//# sourceMappingURL=update-board-column.service.js.map