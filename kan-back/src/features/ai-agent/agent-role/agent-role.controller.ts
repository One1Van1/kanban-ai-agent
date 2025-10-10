import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { AgentRoleService, AgentRole } from './agent-role.service';

class ConfigureAgentRoleRequestDto {
  @ApiProperty({ enum: AgentRole, description: 'Основная роль агента' })
  @IsString()
  primaryRole: AgentRole;

  @ApiProperty({
    enum: AgentRole,
    isArray: true,
    required: false,
    description: 'Дополнительные роли',
  })
  @IsOptional()
  @IsArray()
  secondaryRoles?: AgentRole[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Области экспертизы',
  })
  @IsOptional()
  @IsArray()
  expertiseAreas?: string[];
}

class GetOptimalRoleRequestDto {
  @ApiProperty({ description: 'Тип задачи', example: 'bug' })
  @IsString()
  taskType: string;

  @ApiProperty({ description: 'Название колонки', example: 'In Progress' })
  @IsString()
  columnName: string;

  @ApiProperty({ description: 'Уровень срочности', example: 'high' })
  @IsString()
  urgency: string;

  @ApiProperty({ description: 'Уровень сложности', example: 'medium' })
  @IsString()
  complexity: string;
}

class GetTeamRecommendationsRequestDto {
  @ApiProperty({ description: 'Размер команды', example: 5 })
  @IsNumber()
  teamSize: number;

  @ApiProperty({ description: 'Тип проекта', example: 'enterprise' })
  @IsString()
  projectType: string;
}

@ApiTags('AI Agent Roles')
@Controller('ai-agent/roles')
export class AgentRoleController {
  private readonly logger = new Logger(AgentRoleController.name);

  constructor(private readonly roleService: AgentRoleService) {}

  @Get('available')
  @ApiOperation({
    summary: 'Получить доступные роли агентов',
    description: 'Возвращает список всех доступных ролей для AI агентов',
  })
  @ApiResponse({
    status: 200,
    description: 'Список ролей получен успешно',
  })
  getAvailableRoles(): { roles: AgentRole[] } {
    this.logger.log('📋 Getting available agent roles...');

    const roles = this.roleService.getAvailableRoles();

    return { roles };
  }

  @Post(':agentId/configure')
  @ApiOperation({
    summary: 'Настроить специализацию агента',
    description: 'Назначает основную и дополнительные роли агенту',
  })
  @ApiParam({ name: 'agentId', description: 'ID агента' })
  @ApiResponse({
    status: 200,
    description: 'Специализация агента настроена успешно',
  })
  configureAgentRole(
    @Param('agentId') agentId: string,
    @Body() request: ConfigureAgentRoleRequestDto,
  ): {
    success: boolean;
    specialization: any;
  } {
    this.logger.log(
      `🎪 Configuring role for agent ${agentId}: ${request.primaryRole}`,
    );

    const specialization = this.roleService.configureAgentSpecialization(
      agentId,
      request.primaryRole,
      request.secondaryRoles || [],
      request.expertiseAreas || [],
    );

    return {
      success: true,
      specialization,
    };
  }

  @Get(':agentId/specialization')
  @ApiOperation({
    summary: 'Получить специализацию агента',
    description:
      'Возвращает текущую специализацию и метрики производительности агента',
  })
  @ApiParam({ name: 'agentId', description: 'ID агента' })
  @ApiResponse({
    status: 200,
    description: 'Специализация агента получена успешно',
  })
  getAgentSpecialization(@Param('agentId') agentId: string): {
    specialization: any;
  } {
    this.logger.log(`🎭 Getting specialization for agent: ${agentId}`);

    const specialization = this.roleService.getAgentSpecialization(agentId);

    return { specialization };
  }

  @Post('determine-optimal')
  @ApiOperation({
    summary: 'Определить оптимальную роль для ситуации',
    description: 'Анализирует контекст и определяет наиболее подходящую роль',
  })
  @ApiResponse({
    status: 200,
    description: 'Оптимальная роль определена успешно',
  })
  determineOptimalRole(@Body() request: GetOptimalRoleRequestDto): {
    optimalRole: AgentRole;
    reasoning: string;
  } {
    this.logger.log(
      `🎯 Determining optimal role for: ${request.taskType} in ${request.columnName}`,
    );

    const optimalRole = this.roleService.determineOptimalRole(
      request.taskType,
      request.columnName,
      'task_processing',
      request.urgency,
      request.complexity,
    );

    return {
      optimalRole,
      reasoning: `Для задачи типа "${request.taskType}" в колонке "${request.columnName}" с приоритетом "${request.urgency}" оптимальной является роль ${optimalRole}`,
    };
  }

  @Get('role/:role/configuration')
  @ApiOperation({
    summary: 'Получить конфигурацию роли',
    description: 'Возвращает детальную конфигурацию указанной роли',
  })
  @ApiParam({ name: 'role', description: 'Название роли' })
  @ApiResponse({
    status: 200,
    description: 'Конфигурация роли получена успешно',
  })
  getRoleConfiguration(@Param('role') role: AgentRole): {
    configuration: any;
  } {
    this.logger.log(`⚙️ Getting configuration for role: ${role}`);

    const configuration = this.roleService.getRoleConfiguration(role);

    return { configuration };
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Получить статистику по ролям',
    description:
      'Возвращает статистику использования и производительности всех ролей',
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика получена успешно',
  })
  getRoleStatistics(): {
    statistics: Record<AgentRole, any>;
  } {
    this.logger.log('📊 Getting role statistics...');

    const statistics = this.roleService.getRoleStatistics();

    return { statistics };
  }

  @Post('team-recommendations')
  @ApiOperation({
    summary: 'Получить рекомендации по ролям для команды',
    description:
      'Предлагает оптимальное распределение ролей для команды заданного размера',
  })
  @ApiResponse({
    status: 200,
    description: 'Рекомендации получены успешно',
  })
  getTeamRoleRecommendations(
    @Body() request: GetTeamRecommendationsRequestDto,
  ): {
    recommendedRoles: AgentRole[];
    roleDistribution: Record<AgentRole, number>;
    reasoning: string[];
  } {
    this.logger.log(
      `🎪 Getting team role recommendations for team size: ${request.teamSize}, project: ${request.projectType}`,
    );

    const recommendations = this.roleService.getTeamRoleRecommendations(
      request.teamSize,
      request.projectType,
    );

    return recommendations;
  }

  @Post(':agentId/adapt-role')
  @ApiOperation({
    summary: 'Адаптировать роль агента на основе производительности',
    description:
      'Анализирует производительность агента и предлагает изменения роли',
  })
  @ApiParam({ name: 'agentId', description: 'ID агента' })
  @ApiResponse({
    status: 200,
    description: 'Анализ адаптации выполнен успешно',
  })
  adaptAgentRole(@Param('agentId') agentId: string): {
    currentRole: AgentRole | null;
    suggestedRole: AgentRole | null;
    shouldAdapt: boolean;
    reasoning: string;
  } {
    this.logger.log(`🎨 Analyzing role adaptation for agent: ${agentId}`);

    const currentSpecialization =
      this.roleService.getAgentSpecialization(agentId);
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
}
