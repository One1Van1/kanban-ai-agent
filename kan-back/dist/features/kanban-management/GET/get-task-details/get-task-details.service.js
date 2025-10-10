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
exports.GetTaskDetailsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const get_task_details_response_dto_1 = require("./get-task-details.response.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let GetTaskDetailsService = class GetTaskDetailsService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(taskId) {
        const latestTaskRecord = await this.taskHistoryRepository.findOne({
            where: { taskId: taskId.toString() },
            order: { createdAt: 'DESC' },
        });
        if (!latestTaskRecord) {
            throw new common_2.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const taskHistory = await this.taskHistoryRepository.find({
            where: { taskId: taskId.toString() },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        return new get_task_details_response_dto_1.GetTaskDetailsResponseDto(latestTaskRecord, taskHistory);
    }
};
exports.GetTaskDetailsService = GetTaskDetailsService;
exports.GetTaskDetailsService = GetTaskDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GetTaskDetailsService);
//# sourceMappingURL=get-task-details.service.js.map