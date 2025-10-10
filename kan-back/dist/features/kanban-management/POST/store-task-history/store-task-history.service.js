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
exports.StoreTaskHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_task_history_response_dto_1 = require("./store-task-history.response.dto");
const task_history_entity_1 = require("kan-back/src/entities/task-history.entity");
let StoreTaskHistoryService = class StoreTaskHistoryService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(dto) {
        const taskHistory = this.taskHistoryRepository.create({
            agentId: dto.agentId,
            taskId: dto.taskId,
            taskKey: dto.taskKey,
            taskTitle: dto.taskTitle,
            action: dto.action,
            fromStatus: dto.fromStatus,
            toStatus: dto.toStatus,
            fromColumn: dto.fromColumn,
            toColumn: dto.toColumn,
            context: dto.context,
            agentResponse: dto.agentResponse,
            executedInstruction: dto.executedInstruction,
            status: dto.status || 'pending',
            error: dto.error,
            processingTimeMs: dto.processingTimeMs,
        });
        const savedHistory = await this.taskHistoryRepository.save(taskHistory);
        return new store_task_history_response_dto_1.StoreTaskHistoryResponseDto(savedHistory.id, 'Task history stored successfully');
    }
};
exports.StoreTaskHistoryService = StoreTaskHistoryService;
exports.StoreTaskHistoryService = StoreTaskHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoreTaskHistoryService);
//# sourceMappingURL=store-task-history.service.js.map