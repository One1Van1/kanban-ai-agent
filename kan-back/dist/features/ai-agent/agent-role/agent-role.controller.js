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
var AgentRoleController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const agent_role_service_1 = require("./agent-role.service");
class ConfigureAgentRoleRequestDto {
    primaryRole;
    secondaryRoles;
    expertiseAreas;
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: agent_role_service_1.AgentRole, description: 'Основная роль агента' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigureAgentRoleRequestDto.prototype, "primaryRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: agent_role_service_1.AgentRole,
        isArray: true,
        required: false,
        description: 'Дополнительные роли',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ConfigureAgentRoleRequestDto.prototype, "secondaryRoles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        required: false,
        description: 'Области экспертизы',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ConfigureAgentRoleRequestDto.prototype, "expertiseAreas", void 0);
class GetOptimalRoleRequestDto {
    taskType;
    columnName;
    urgency;
    complexity;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Тип задачи', example: 'bug' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOptimalRoleRequestDto.prototype, "taskType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название колонки', example: 'In Progress' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOptimalRoleRequestDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Уровень срочности', example: 'high' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOptimalRoleRequestDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Уровень сложности', example: 'medium' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOptimalRoleRequestDto.prototype, "complexity", void 0);
class GetTeamRecommendationsRequestDto {
    teamSize;
    projectType;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Размер команды', example: 5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetTeamRecommendationsRequestDto.prototype, "teamSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Тип проекта', example: 'enterprise' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetTeamRecommendationsRequestDto.prototype, "projectType", void 0);
let AgentRoleController = AgentRoleController_1 = class AgentRoleController {
    roleService;
    logger = new common_1.Logger(AgentRoleController_1.name);
    constructor(roleService) {
        this.roleService = roleService;
    }
    getAvailableRoles() {
        this.logger.log('📋 Getting available agent roles...');
        const roles = this.roleService.getAvailableRoles();
        return { roles };
    }
    configureAgentRole(agentId, request) {
        this.logger.log(`🎪 Configuring role for agent ${agentId}: ${request.primaryRole}`);
        const specialization = this.roleService.configureAgentSpecialization(agentId, request.primaryRole, request.secondaryRoles || [], request.expertiseAreas || []);
        return {
            success: true,
            specialization,
        };
    }
    getAgentSpecialization(agentId) {
        this.logger.log(`🎭 Getting specialization for agent: ${agentId}`);
        const specialization = this.roleService.getAgentSpecialization(agentId);
        return { specialization };
    }
    determineOptimalRole(request) {
        this.logger.log(`🎯 Determining optimal role for: ${request.taskType} in ${request.columnName}`);
        const optimalRole = this.roleService.determineOptimalRole(request.taskType, request.columnName, 'task_processing', request.urgency, request.complexity);
        return {
            optimalRole,
            reasoning: `Для задачи типа "${request.taskType}" в колонке "${request.columnName}" с приоритетом "${request.urgency}" оптимальной является роль ${optimalRole}`,
        };
    }
    getRoleConfiguration(role) {
        this.logger.log(`⚙️ Getting configuration for role: ${role}`);
        const configuration = this.roleService.getRoleConfiguration(role);
        return { configuration };
    }
    getRoleStatistics() {
        this.logger.log('📊 Getting role statistics...');
        const statistics = this.roleService.getRoleStatistics();
        return { statistics };
    }
    getTeamRoleRecommendations(request) {
        this.logger.log(`🎪 Getting team role recommendations for team size: ${request.teamSize}, project: ${request.projectType}`);
        const recommendations = this.roleService.getTeamRoleRecommendations(request.teamSize, request.projectType);
        return recommendations;
    }
    adaptAgentRole(agentId) {
        this.logger.log(`🎨 Analyzing role adaptation for agent: ${agentId}`);
        const currentSpecialization = this.roleService.getAgentSpecialization(agentId);
        const suggestedRole = this.roleService.adaptAgentRole(agentId);
        return {
            currentRole: currentSpecialization?.primaryRole || null,
            suggestedRole,
            shouldAdapt: suggestedRole !== null,
            reasoning: suggestedRole
                ? `Рекомендуется изменить роль на ${suggestedRole} для улучшения производительности`
                : 'Текущая роль оптимальна, изменения не требуются',
        };
    }
};
exports.AgentRoleController = AgentRoleController;
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить доступные роли агентов',
        description: 'Возвращает список всех доступных ролей для AI агентов',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список ролей получен успешно',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "getAvailableRoles", null);
__decorate([
    (0, common_1.Post)(':agentId/configure'),
    (0, swagger_1.ApiOperation)({
        summary: 'Настроить специализацию агента',
        description: 'Назначает основную и дополнительные роли агенту',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'ID агента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Специализация агента настроена успешно',
    }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ConfigureAgentRoleRequestDto]),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "configureAgentRole", null);
__decorate([
    (0, common_1.Get)(':agentId/specialization'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить специализацию агента',
        description: 'Возвращает текущую специализацию и метрики производительности агента',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'ID агента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Специализация агента получена успешно',
    }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "getAgentSpecialization", null);
__decorate([
    (0, common_1.Post)('determine-optimal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Определить оптимальную роль для ситуации',
        description: 'Анализирует контекст и определяет наиболее подходящую роль',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Оптимальная роль определена успешно',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetOptimalRoleRequestDto]),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "determineOptimalRole", null);
__decorate([
    (0, common_1.Get)('role/:role/configuration'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить конфигурацию роли',
        description: 'Возвращает детальную конфигурацию указанной роли',
    }),
    (0, swagger_1.ApiParam)({ name: 'role', description: 'Название роли' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Конфигурация роли получена успешно',
    }),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "getRoleConfiguration", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить статистику по ролям',
        description: 'Возвращает статистику использования и производительности всех ролей',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Статистика получена успешно',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "getRoleStatistics", null);
__decorate([
    (0, common_1.Post)('team-recommendations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить рекомендации по ролям для команды',
        description: 'Предлагает оптимальное распределение ролей для команды заданного размера',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Рекомендации получены успешно',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetTeamRecommendationsRequestDto]),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "getTeamRoleRecommendations", null);
__decorate([
    (0, common_1.Post)(':agentId/adapt-role'),
    (0, swagger_1.ApiOperation)({
        summary: 'Адаптировать роль агента на основе производительности',
        description: 'Анализирует производительность агента и предлагает изменения роли',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'ID агента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Анализ адаптации выполнен успешно',
    }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], AgentRoleController.prototype, "adaptAgentRole", null);
exports.AgentRoleController = AgentRoleController = AgentRoleController_1 = __decorate([
    (0, swagger_1.ApiTags)('AI Agent Roles'),
    (0, common_1.Controller)('ai-agent/roles'),
    __metadata("design:paramtypes", [agent_role_service_1.AgentRoleService])
], AgentRoleController);
//# sourceMappingURL=agent-role.controller.js.map