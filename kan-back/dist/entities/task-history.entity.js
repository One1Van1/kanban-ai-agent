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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskHistory = void 0;
const typeorm_1 = require("typeorm");
const agent_entity_1 = require("./agent.entity");
let TaskHistory = class TaskHistory {
    id;
    agentId;
    taskId;
    taskKey;
    taskTitle;
    action;
    fromStatus;
    toStatus;
    fromColumn;
    toColumn;
    context;
    agentResponse;
    executedInstruction;
    status;
    error;
    processingTimeMs;
    createdAt;
    agent;
};
exports.TaskHistory = TaskHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TaskHistory.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TaskHistory.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TaskHistory.prototype, "taskKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], TaskHistory.prototype, "taskTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], TaskHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TaskHistory.prototype, "fromStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TaskHistory.prototype, "toStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TaskHistory.prototype, "fromColumn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TaskHistory.prototype, "toColumn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TaskHistory.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TaskHistory.prototype, "agentResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TaskHistory.prototype, "executedInstruction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], TaskHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TaskHistory.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], TaskHistory.prototype, "processingTimeMs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, (agent) => agent.taskHistories),
    (0, typeorm_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], TaskHistory.prototype, "agent", void 0);
exports.TaskHistory = TaskHistory = __decorate([
    (0, typeorm_1.Entity)('task_histories')
], TaskHistory);
//# sourceMappingURL=task-history.entity.js.map