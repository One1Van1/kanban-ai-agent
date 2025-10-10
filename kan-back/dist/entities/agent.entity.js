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
exports.Agent = void 0;
const typeorm_1 = require("typeorm");
const agent_instruction_entity_1 = require("./agent-instruction.entity");
const task_history_entity_1 = require("./task-history.entity");
let Agent = class Agent {
    id;
    name;
    description;
    status;
    config;
    jiraInstanceUrl;
    jiraProjectKey;
    jiraApiToken;
    contextSources;
    notificationSettings;
    createdBy;
    createdAt;
    updatedAt;
    instructions;
    taskHistories;
};
exports.Agent = Agent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Agent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Agent.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Agent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Agent.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "jiraInstanceUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "jiraProjectKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "jiraApiToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Agent.prototype, "contextSources", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Agent.prototype, "notificationSettings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Agent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Agent.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agent_instruction_entity_1.AgentInstruction, (instruction) => instruction.agent),
    __metadata("design:type", Array)
], Agent.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_history_entity_1.TaskHistory, (history) => history.agent),
    __metadata("design:type", Array)
], Agent.prototype, "taskHistories", void 0);
exports.Agent = Agent = __decorate([
    (0, typeorm_1.Entity)('agents')
], Agent);
//# sourceMappingURL=agent.entity.js.map