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
exports.CreateTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const create_task_response_dto_1 = require("./create-task.response.dto");
const task_history_entity_1 = require("../../../../entities/task-history.entity");
let CreateTaskService = class CreateTaskService {
    taskHistoryRepository;
    constructor(taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }
    async execute(createDto) {
        const existingTask = await this.taskHistoryRepository.findOne({
            where: { taskKey: createDto.taskKey },
        });
        if (existingTask) {
            throw new common_2.ConflictException(`Task with key ${createDto.taskKey} already exists`);
        }
        const taskHistory = this.taskHistoryRepository.create({
            taskId: createDto.taskKey,
            taskKey: createDto.taskKey,
            taskTitle: createDto.taskTitle,
            action: 'created',
            toColumn: createDto.initialColumn,
            toStatus: createDto.initialStatus || 'pending',
            status: 'completed',
            context: createDto.context || {},
            agentId: createDto.agentId || 'system',
            agentResponse: {
                success: true,
                message: 'Task created successfully',
                timestamp: new Date().toISOString(),
            },
        });
        const savedTask = await this.taskHistoryRepository.save(taskHistory);
        return new create_task_response_dto_1.CreateTaskResponseDto(savedTask);
    }
};
exports.CreateTaskService = CreateTaskService;
exports.CreateTaskService = CreateTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CreateTaskService);
//# sourceMappingURL=create-task.service.js.map