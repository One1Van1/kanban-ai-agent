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
exports.GetTaskStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const get_task_statistics_response_dto_1 = require("./get-task-statistics.response.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetTaskStatisticsService = class GetTaskStatisticsService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(query) {
        const queryBuilder = this.taskHistoryRepository.createQueryBuilder('history');
        if (query.agentId) {
            queryBuilder.where('history.agentId = :agentId', {
                agentId: query.agentId,
            });
        }
        const [total, completed, failed, pending] = await Promise.all([
            queryBuilder.getCount(),
            queryBuilder
                .clone()
                .andWhere('history.status = :status', { status: 'completed' })
                .getCount(),
            queryBuilder
                .clone()
                .andWhere('history.status = :status', { status: 'failed' })
                .getCount(),
            queryBuilder
                .clone()
                .andWhere('history.status = :status', { status: 'pending' })
                .getCount(),
        ]);
        const processing = total - completed - failed - pending;
        return new get_task_statistics_response_dto_1.GetTaskStatisticsResponseDto({
            total,
            completed,
            failed,
            pending,
            processing,
        }, query.agentId);
    }
};
exports.GetTaskStatisticsService = GetTaskStatisticsService;
exports.GetTaskStatisticsService = GetTaskStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetTaskStatisticsService);
//# sourceMappingURL=get-task-statistics.service.js.map