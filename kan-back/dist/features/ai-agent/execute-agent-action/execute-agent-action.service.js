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
var ExecuteAgentActionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteAgentActionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const execute_agent_action_request_dto_1 = require("./execute-agent-action.request.dto");
const execute_agent_action_response_dto_1 = require("./execute-agent-action.response.dto");
const instruction_executor_service_1 = require("../instruction-executor/instruction-executor.service");
const agent_instruction_entity_1 = require("../../../entities/agent-instruction.entity");
const agent_entity_1 = require("../../../entities/agent.entity");
let ExecuteAgentActionService = ExecuteAgentActionService_1 = class ExecuteAgentActionService {
    agentRepository;
    agentInstructionRepository;
    instructionExecutorService;
    logger = new common_1.Logger(ExecuteAgentActionService_1.name);
    agentActivities = new Map();
    constructor(agentRepository, agentInstructionRepository, instructionExecutorService) {
        this.agentRepository = agentRepository;
        this.agentInstructionRepository = agentInstructionRepository;
        this.instructionExecutorService = instructionExecutorService;
    }
    async execute(request) {
        const startTime = Date.now();
        const executionId = (0, crypto_1.randomUUID)();
        this.logger.log(`Executing agent action - Agent: ${request.agentId}, Task: ${request.taskId}, Trigger: ${request.triggerType}`);
        try {
            await this.validateRequest(request);
            const agentConfig = await this.getAgentConfig(request.agentId);
            const columnInstructions = await this.getColumnInstructions(request.agentId, request.boardId, request.columnId);
            const shouldExecute = this.shouldExecuteAgent(request, columnInstructions);
            if (!shouldExecute || !columnInstructions) {
                return this.createSkippedResponse(executionId, request, startTime);
            }
            const actions = await this.performAgentActions(request, columnInstructions, agentConfig);
            const executionTime = Date.now() - startTime;
            const activity = {
                id: executionId,
                agentId: request.agentId,
                taskId: request.taskId,
                action: `${request.triggerType}_executed`,
                result: 'success',
                input: request,
                output: actions,
                executionTime,
                createdAt: new Date(),
            };
            this.agentActivities.set(executionId, activity);
            this.logger.log(`Agent action executed successfully: ${executionId} in ${executionTime}ms`);
            return new execute_agent_action_response_dto_1.ExecuteAgentActionResponseDto({
                executionId,
                agentId: request.agentId,
                taskId: request.taskId,
                result: execute_agent_action_response_dto_1.AgentActionResult.SUCCESS,
                actions,
                summary: this.generateSummary(actions),
                executionTimeMs: executionTime,
                metadata: {
                    triggerType: request.triggerType,
                    columnName: request.columnName,
                    actionsCount: actions.length,
                },
                executedAt: new Date(),
            });
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            this.logger.error(`Failed to execute agent action: ${error.message}`, error.stack);
            const activity = {
                id: executionId,
                agentId: request.agentId,
                taskId: request.taskId,
                action: `${request.triggerType}_failed`,
                result: 'error',
                input: request,
                error: error.message,
                executionTime,
                createdAt: new Date(),
            };
            this.agentActivities.set(executionId, activity);
            return new execute_agent_action_response_dto_1.ExecuteAgentActionResponseDto({
                executionId,
                agentId: request.agentId,
                taskId: request.taskId,
                result: execute_agent_action_response_dto_1.AgentActionResult.ERROR,
                actions: [],
                summary: 'Agent execution failed',
                executionTimeMs: executionTime,
                error: error.message,
                executedAt: new Date(),
            });
        }
    }
    async validateRequest(request) {
        if (!request.agentId || request.agentId.trim().length === 0) {
            throw new common_1.BadRequestException('Agent ID is required');
        }
        if (!request.taskId || request.taskId.trim().length === 0) {
            throw new common_1.BadRequestException('Task ID is required');
        }
        if (!request.boardId || request.boardId.trim().length === 0) {
            throw new common_1.BadRequestException('Board ID is required');
        }
        if (!request.columnId || request.columnId.trim().length === 0) {
            throw new common_1.BadRequestException('Column ID is required');
        }
        if (!request.taskData || Object.keys(request.taskData).length === 0) {
            throw new common_1.BadRequestException('Task data is required');
        }
    }
    async getAgentConfig(agentId) {
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${agentId} not found`);
        }
        if (agent.status !== 'active') {
            throw new common_1.BadRequestException(`Agent ${agentId} is not active (status: ${agent.status})`);
        }
        return agent;
    }
    async getColumnInstructions(agentId, boardId, columnId) {
        this.logger.log(`🔍 Searching for instructions: agentId=${agentId}, columnId=${columnId}`);
        const instruction = await this.agentInstructionRepository.findOne({
            where: {
                agentId,
                columnId,
            },
        });
        if (instruction) {
            this.logger.log(`✅ Found instruction: ${instruction.id} - ${instruction.instruction} (triggerEvent: ${instruction.triggerEvent}, isActive: ${instruction.isActive})`);
        }
        else {
            this.logger.warn(`❌ No instructions found for agent ${agentId} in column ${columnId}`);
            const allInstructions = await this.agentInstructionRepository.find({
                where: { agentId },
            });
            this.logger.warn(`📋 All instructions for agent ${agentId}:`, allInstructions.map((i) => `columnId=${i.columnId}, triggerEvent=${i.triggerEvent}, isActive=${i.isActive}`));
        }
        return instruction;
    }
    shouldExecuteAgent(request, columnInstructions) {
        if (!columnInstructions || !columnInstructions.isActive) {
            this.logger.log('Agent execution skipped: no active instructions found');
            return false;
        }
        const shouldExecute = columnInstructions.triggerEvent === 'on_enter' &&
            request.triggerType === execute_agent_action_request_dto_1.AgentActionTrigger.TASK_MOVED_TO_COLUMN;
        this.logger.log(`Trigger check: ${request.triggerType} matches ${columnInstructions.triggerEvent} = ${shouldExecute}`);
        return shouldExecute;
    }
    async performAgentActions(request, columnInstructions, agentConfig) {
        this.logger.log(`🤖 AI Agent executing instruction: "${columnInstructions.instruction}"`);
        return await this.instructionExecutorService.executeInstruction(columnInstructions, agentConfig, request);
    }
    createSkippedResponse(executionId, request, startTime) {
        const executionTime = Date.now() - startTime;
        return new execute_agent_action_response_dto_1.ExecuteAgentActionResponseDto({
            executionId,
            agentId: request.agentId,
            taskId: request.taskId,
            result: execute_agent_action_response_dto_1.AgentActionResult.SKIPPED,
            actions: [],
            summary: 'Agent execution skipped - no matching trigger conditions',
            executionTimeMs: executionTime,
            metadata: {
                reason: 'no_matching_triggers',
                triggerType: request.triggerType,
            },
            executedAt: new Date(),
        });
    }
    generateSummary(actions) {
        if (actions.length === 0) {
            return 'No actions performed';
        }
        const actionTypes = actions.map((action) => action.actionType);
        return `Performed ${actions.length} action(s): ${actionTypes.join(', ')}`;
    }
    async getAgentActivity(executionId) {
        return this.agentActivities.get(executionId) || null;
    }
    async getAgentActivitiesByAgent(agentId) {
        const activities = [];
        for (const activity of this.agentActivities.values()) {
            if (activity.agentId === agentId) {
                activities.push(activity);
            }
        }
        return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
};
exports.ExecuteAgentActionService = ExecuteAgentActionService;
exports.ExecuteAgentActionService = ExecuteAgentActionService = ExecuteAgentActionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_instruction_entity_1.AgentInstruction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        instruction_executor_service_1.InstructionExecutorService])
], ExecuteAgentActionService);
//# sourceMappingURL=execute-agent-action.service.js.map