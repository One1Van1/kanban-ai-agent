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
exports.AgentInstruction = void 0;
const typeorm_1 = require("typeorm");
const agent_entity_1 = require("./agent.entity");
let AgentInstruction = class AgentInstruction {
    id;
    agentId;
    columnId;
    columnName;
    instruction;
    triggerEvent;
    conditions;
    actions;
    isActive;
    priority;
    createdAt;
    updatedAt;
    agent;
};
exports.AgentInstruction = AgentInstruction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AgentInstruction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AgentInstruction.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AgentInstruction.prototype, "columnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AgentInstruction.prototype, "columnName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AgentInstruction.prototype, "instruction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AgentInstruction.prototype, "triggerEvent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AgentInstruction.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AgentInstruction.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AgentInstruction.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], AgentInstruction.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AgentInstruction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AgentInstruction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, (agent) => agent.instructions),
    (0, typeorm_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], AgentInstruction.prototype, "agent", void 0);
exports.AgentInstruction = AgentInstruction = __decorate([
    (0, typeorm_1.Entity)('agent_instructions')
], AgentInstruction);
//# sourceMappingURL=agent-instruction.entity.js.map