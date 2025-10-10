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
var CreateTaskQueueController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskQueueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_task_queue_service_1 = require("./create-task-queue.service");
const create_task_queue_dto_1 = require("./create-task-queue.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let CreateTaskQueueController = CreateTaskQueueController_1 = class CreateTaskQueueController {
    createTaskQueueService;
    logger = new common_1.Logger(CreateTaskQueueController_1.name);
    constructor(createTaskQueueService) {
        this.createTaskQueueService = createTaskQueueService;
    }
    async handle(requestDto) {
        this.logger.log(`Received request to add task ${requestDto.taskId} to queue`);
        return this.createTaskQueueService.addTaskToQueue(requestDto);
    }
};
exports.CreateTaskQueueController = CreateTaskQueueController;
__decorate([
    (0, common_1.Post)('tasks'),
    (0, openapi_decorator_1.ApiCreateTaskQueue)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_queue_dto_1.CreateTaskQueueRequestDto]),
    __metadata("design:returntype", Promise)
], CreateTaskQueueController.prototype, "handle", null);
exports.CreateTaskQueueController = CreateTaskQueueController = CreateTaskQueueController_1 = __decorate([
    (0, common_1.Controller)('queue'),
    (0, swagger_1.ApiTags)('CreateTaskQueue'),
    __metadata("design:paramtypes", [create_task_queue_service_1.CreateTaskQueueService])
], CreateTaskQueueController);
//# sourceMappingURL=create-task-queue.controller.js.map