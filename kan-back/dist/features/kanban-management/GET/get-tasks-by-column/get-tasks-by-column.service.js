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
exports.GetTasksByColumnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const get_tasks_by_column_response_dto_1 = require("./get-tasks-by-column.response.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetTasksByColumnService = class GetTasksByColumnService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(column, query) {
        const subQuery = this.taskHistoryRepository
            .createQueryBuilder('th_sub')
            .select('th_sub.taskId')
            .addSelect('MAX(th_sub.createdAt)', 'maxCreatedAt')
            .where('th_sub.toColumn = :column OR th_sub.fromColumn = :column', {
            column,
        })
            .groupBy('th_sub.taskId');
        const tasksQuery = this.taskHistoryRepository
            .createQueryBuilder('th')
            .innerJoin(`(${subQuery.getQuery()})`, 'latest', 'th.taskId = latest.taskId AND th.createdAt = latest.maxCreatedAt')
            .where('th.toColumn = :column', { column })
            .setParameters(subQuery.getParameters())
            .orderBy('th.createdAt', 'DESC')
            .skip(query.offset || 0)
            .take(query.limit || 10);
        const [tasks, total] = await Promise.all([
            tasksQuery.getMany(),
            this.taskHistoryRepository
                .createQueryBuilder('th')
                .innerJoin(`(${subQuery.getQuery()})`, 'latest', 'th.taskId = latest.taskId AND th.createdAt = latest.maxCreatedAt')
                .where('th.toColumn = :column', { column })
                .setParameters(subQuery.getParameters())
                .getCount(),
        ]);
        return new get_tasks_by_column_response_dto_1.GetTasksByColumnResponseDto(tasks, total, column, query);
    }
};
exports.GetTasksByColumnService = GetTasksByColumnService;
exports.GetTasksByColumnService = GetTasksByColumnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetTasksByColumnService);
//# sourceMappingURL=get-tasks-by-column.service.js.map