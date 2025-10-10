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
var ConfigureColumnInstructionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureColumnInstructionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configure_column_instructions_response_dto_1 = require("./configure-column-instructions.response.dto");
const agent_instruction_entity_1 = require("../../../entities/agent-instruction.entity");
let ConfigureColumnInstructionsService = ConfigureColumnInstructionsService_1 = class ConfigureColumnInstructionsService {
    agentInstructionRepository;
    logger = new common_1.Logger(ConfigureColumnInstructionsService_1.name);
    constructor(agentInstructionRepository) {
        this.agentInstructionRepository = agentInstructionRepository;
    }
    async execute(request) {
        this.logger.log(`Configuring column instructions for agent: ${request.agentId}, column: ${request.columnId}`);
        try {
            await this.validateAgent(request.agentId);
            this.validateColumnData(request);
            const instructionKey = `${request.agentId}:${request.boardId}:${request.columnId}`;
            this.logger.log(`🔍 Creating instruction for agent: ${request.agentId}, column: ${request.columnName}`);
            let savedInstruction;
            try {
                const agentInstruction = this.agentInstructionRepository.create({
                    agentId: request.agentId,
                    columnId: request.columnId,
                    columnName: request.columnName,
                    instruction: request.instructions,
                    triggerEvent: 'on_enter',
                    conditions: request.triggerConditions || [],
                    actions: {
                        type: 'send_telegram_notification',
                        template: 'Новая задача назначена на вас: {summary}',
                    },
                    isActive: request.isActive,
                    priority: 0,
                });
                this.logger.log(`💾 Saving to database...`);
                savedInstruction =
                    await this.agentInstructionRepository.save(agentInstruction);
                this.logger.log(`✅ Saved! ID: ${savedInstruction.id}`);
                const verifyInstruction = await this.agentInstructionRepository.findOne({
                    where: { id: savedInstruction.id },
                });
                this.logger.log(`🔍 Verification: ${verifyInstruction ? 'FOUND' : 'NOT FOUND'} in DB`);
                if (!verifyInstruction) {
                    throw new Error('Instruction was not saved to database!');
                }
            }
            catch (saveError) {
                this.logger.error(`💥 Database save error:`, saveError);
                throw saveError;
            }
            this.logger.log(`✅ Column instructions saved to PostgreSQL: ${savedInstruction.id}`);
            const triggerConditionsResponse = request.triggerConditions?.map((condition) => new configure_column_instructions_response_dto_1.AgentTriggerConditionResponseDto({
                type: condition.type,
                value: condition.value,
                operator: condition.operator,
            }));
            const responseDto = new configure_column_instructions_response_dto_1.AgentColumnInstructionResponseDto({
                id: savedInstruction.id,
                agentId: savedInstruction.agentId,
                boardId: request.boardId,
                columnId: savedInstruction.columnId,
                columnName: savedInstruction.columnName,
                instructions: savedInstruction.instruction,
                triggerConditions: triggerConditionsResponse,
                isActive: savedInstruction.isActive,
                createdAt: savedInstruction.createdAt,
                updatedAt: savedInstruction.updatedAt,
            });
            return new configure_column_instructions_response_dto_1.ConfigureColumnInstructionsResponseDto(responseDto, 'Column instructions configured successfully');
        }
        catch (error) {
            this.logger.error(`Failed to configure column instructions: ${error.message}`, error.stack);
            throw error;
        }
    }
    async validateAgent(agentId) {
        if (!agentId || agentId.trim().length === 0) {
            throw new common_1.BadRequestException('Agent ID is required');
        }
    }
    validateColumnData(request) {
        if (!request.boardId || request.boardId.trim().length === 0) {
            throw new common_1.BadRequestException('Board ID is required');
        }
        if (!request.columnId || request.columnId.trim().length === 0) {
            throw new common_1.BadRequestException('Column ID is required');
        }
        if (!request.columnName || request.columnName.trim().length === 0) {
            throw new common_1.BadRequestException('Column name is required');
        }
        if (!request.instructions || request.instructions.trim().length === 0) {
            throw new common_1.BadRequestException('Instructions are required');
        }
        if (request.instructions.length > 5000) {
            throw new common_1.BadRequestException('Instructions cannot exceed 5000 characters');
        }
        if (request.triggerConditions && request.triggerConditions.length > 10) {
            throw new common_1.BadRequestException('Cannot have more than 10 trigger conditions');
        }
    }
    async getColumnInstructionsByAgent(agentId) {
        const instructions = await this.agentInstructionRepository.find({
            where: { agentId, isActive: true },
        });
        return instructions.map((instruction) => ({
            id: instruction.id,
            agentId: instruction.agentId,
            boardId: 'main-kanban-board',
            columnId: instruction.columnId,
            columnName: instruction.columnName,
            instructions: instruction.instruction,
            triggerConditions: instruction.conditions,
            isActive: instruction.isActive,
            createdAt: instruction.createdAt,
            updatedAt: instruction.updatedAt,
        }));
    }
    async getColumnInstruction(agentId, boardId, columnId) {
        const instruction = await this.agentInstructionRepository.findOne({
            where: {
                agentId,
                columnId,
                isActive: true,
            },
        });
        if (!instruction)
            return null;
        return {
            id: instruction.id,
            agentId: instruction.agentId,
            boardId: boardId,
            columnId: instruction.columnId,
            columnName: instruction.columnName,
            instructions: instruction.instruction,
            triggerConditions: instruction.conditions,
            isActive: instruction.isActive,
            createdAt: instruction.createdAt,
            updatedAt: instruction.updatedAt,
        };
    }
};
exports.ConfigureColumnInstructionsService = ConfigureColumnInstructionsService;
exports.ConfigureColumnInstructionsService = ConfigureColumnInstructionsService = ConfigureColumnInstructionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_instruction_entity_1.AgentInstruction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfigureColumnInstructionsService);
//# sourceMappingURL=configure-column-instructions.service.js.map