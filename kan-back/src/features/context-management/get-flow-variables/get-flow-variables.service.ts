import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  GetFlowVariablesQueryDto,
  VariableType,
  VariableScope,
} from './get-flow-variables.query.dto';
import {
  GetFlowVariablesResponseDto,
  FlowVariableDto,
  FlowVariablesSummaryDto,
} from './get-flow-variables.response.dto';

@Injectable()
export class GetFlowVariablesService {
  // В реальной реализации здесь будет работа с базой данных
  // Сейчас используем mock данные для демонстрации структуры
  private mockFlowExecutions = new Map<string, any>();

  constructor() {
    // Инициализируем тестовые данные
    this.initializeMockData();
  }

  async execute(
    flowId: string,
    query: GetFlowVariablesQueryDto,
  ): Promise<GetFlowVariablesResponseDto> {
    try {
      // Валидация входных параметров
      if (!flowId) {
        throw new BadRequestException('Flow ID is required');
      }

      // Получаем переменные flow
      const flowExecution = this.mockFlowExecutions.get(flowId);
      if (!flowExecution) {
        throw new NotFoundException(
          `Flow execution with ID ${flowId} not found`,
        );
      }

      // Получаем все переменные
      let variables = flowExecution.variables || [];

      // Применяем фильтры
      variables = this.applyFilters(variables, query);

      // Преобразуем в DTO
      const variableDtos = this.transformToDto(variables);

      // Создаем сводку
      const summary = this.createSummary(variables);

      return new GetFlowVariablesResponseDto(
        variableDtos,
        summary,
        flowId,
        flowExecution.flowTemplateId,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve flow variables: ${error.message}`,
      );
    }
  }

  private applyFilters(variables: any[], query: GetFlowVariablesQueryDto) {
    let filteredVariables = [...variables];

    // Фильтр по типу
    if (query.type) {
      filteredVariables = filteredVariables.filter(
        (v) => v.type === query.type,
      );
    }

    // Фильтр по области видимости
    if (query.scope) {
      filteredVariables = filteredVariables.filter(
        (v) => v.scope === query.scope,
      );
    }

    // Поиск по имени или описанию
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredVariables = filteredVariables.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm) ||
          (v.description && v.description.toLowerCase().includes(searchTerm)),
      );
    }

    // Фильтр переменных со значениями
    if (query.hasValue) {
      filteredVariables = filteredVariables.filter(
        (v) => v.value !== null && v.value !== undefined,
      );
    }

    // Включение/исключение системных переменных
    if (!query.includeSystem) {
      filteredVariables = filteredVariables.filter((v) => !v.isSystem);
    }

    return filteredVariables;
  }

  private transformToDto(variables: any[]): FlowVariableDto[] {
    return variables.map((variable) => ({
      name: variable.name,
      value: variable.value,
      type: variable.type,
      scope: variable.scope,
      description: variable.description,
      createdAt: variable.createdAt,
      updatedAt: variable.updatedAt,
      createdBy: variable.createdBy,
      isSystem: variable.isSystem || false,
      isReadOnly: variable.isReadOnly || false,
      tags: variable.tags || [],
    }));
  }

  private createSummary(variables: any[]): FlowVariablesSummaryDto {
    const typeCount = {
      string: 0,
      number: 0,
      boolean: 0,
      object: 0,
      array: 0,
    };

    const scopeCount = {
      global: 0,
      local: 0,
      shared: 0,
      temporary: 0,
    };

    let variablesWithValues = 0;
    let systemVariables = 0;

    variables.forEach((variable) => {
      // Подсчет по типам
      if (typeCount.hasOwnProperty(variable.type)) {
        typeCount[variable.type as keyof typeof typeCount]++;
      }

      // Подсчет по областям видимости
      if (scopeCount.hasOwnProperty(variable.scope)) {
        scopeCount[variable.scope as keyof typeof scopeCount]++;
      }

      // Подсчет переменных со значениями
      if (variable.value !== null && variable.value !== undefined) {
        variablesWithValues++;
      }

      // Подсчет системных переменных
      if (variable.isSystem) {
        systemVariables++;
      }
    });

    return {
      totalVariables: variables.length,
      typeCount,
      scopeCount,
      variablesWithValues,
      systemVariables,
    };
  }

  private initializeMockData() {
    // Тестовые данные для демонстрации
    const mockVariables = [
      {
        name: 'user_email',
        value: 'john.doe@company.com',
        type: VariableType.STRING,
        scope: VariableScope.GLOBAL,
        description: 'Current user email address',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        createdBy: 'step_1',
        isSystem: false,
        isReadOnly: false,
        tags: ['user', 'email'],
      },
      {
        name: 'task_count',
        value: 42,
        type: VariableType.NUMBER,
        scope: VariableScope.LOCAL,
        description: 'Number of tasks processed',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T12:15:00Z',
        createdBy: 'step_3',
        isSystem: false,
        isReadOnly: false,
        tags: ['counter', 'tasks'],
      },
      {
        name: 'is_processing',
        value: true,
        type: VariableType.BOOLEAN,
        scope: VariableScope.SHARED,
        description: 'Whether flow is currently processing',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T12:45:00Z',
        createdBy: 'system',
        isSystem: true,
        isReadOnly: true,
        tags: ['status', 'system'],
      },
      {
        name: 'task_data',
        value: {
          id: 'PROJ-123',
          title: 'Fix login bug',
          status: 'In Progress',
          assignee: 'john.doe@company.com',
        },
        type: VariableType.OBJECT,
        scope: VariableScope.LOCAL,
        description: 'Current task being processed',
        createdAt: '2024-01-15T11:30:00Z',
        updatedAt: '2024-01-15T11:30:00Z',
        createdBy: 'step_2',
        isSystem: false,
        isReadOnly: false,
        tags: ['task', 'data'],
      },
      {
        name: 'processed_files',
        value: ['file1.jpg', 'file2.pdf', 'file3.doc'],
        type: VariableType.ARRAY,
        scope: VariableScope.LOCAL,
        description: 'List of files processed by AI',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:30:00Z',
        createdBy: 'step_4',
        isSystem: false,
        isReadOnly: false,
        tags: ['files', 'processed'],
      },
    ];

    // Создаем тестовое выполнение flow
    this.mockFlowExecutions.set('flow_exec_123', {
      flowTemplateId: 'marketing_automation_v1',
      status: 'running',
      variables: mockVariables,
      createdAt: '2024-01-15T10:00:00Z',
    });

    this.mockFlowExecutions.set('flow_exec_456', {
      flowTemplateId: 'task_processing_v2',
      status: 'completed',
      variables: mockVariables.slice(0, 3),
      createdAt: '2024-01-14T15:00:00Z',
    });
  }
}
