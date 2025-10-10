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
exports.MoveTaskToColumnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const move_task_response_dto_1 = require("./move-task-response.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let MoveTaskToColumnService = class MoveTaskToColumnService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId, moveDto) {
        const currentTaskState = await this.taskHistoryRepository.findOne({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
        if (!currentTaskState) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const moveHistory = this.taskHistoryRepository.create({
            taskId: taskId,
            taskKey: currentTaskState.taskKey,
            taskTitle: currentTaskState.taskTitle,
            action: 'moved',
            fromColumn: currentTaskState.toColumn,
            toColumn: moveDto.targetColumn,
            fromStatus: currentTaskState.toStatus,
            toStatus: moveDto.newStatus || currentTaskState.toStatus,
            status: 'completed',
            context: {
                ...currentTaskState.context,
                ...moveDto.context,
                moveReason: moveDto.context?.reason || 'Task moved to new column',
                previousState: {
                    column: currentTaskState.toColumn,
                    status: currentTaskState.toStatus,
                },
            },
            agentId: moveDto.agentId || currentTaskState.agentId || 'system',
            agentResponse: {
                success: true,
                message: `Task moved from "${currentTaskState.toColumn}" to "${moveDto.targetColumn}"`,
                timestamp: new Date().toISOString(),
                triggerType: moveDto.triggerType || 'manual',
            },
        });
        const savedMove = await this.taskHistoryRepository.save(moveHistory);
        return new move_task_response_dto_1.MoveTaskResponseDto(savedMove, currentTaskState);
    }
};
exports.MoveTaskToColumnService = MoveTaskToColumnService;
exports.MoveTaskToColumnService = MoveTaskToColumnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MoveTaskToColumnService);
//# sourceMappingURL=move-task-to-column.service.js.map