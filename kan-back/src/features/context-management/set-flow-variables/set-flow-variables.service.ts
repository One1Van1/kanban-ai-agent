import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  SetFlowVariablesRequestDto,
  FlowVariableInputDto,
  VariableType,
  VariableScope,
  UpdateMode,
} from './set-flow-variables.request.dto';
import {
  SetFlowVariablesResponseDto,
  SetVariableResultDto,
  SetFlowVariablesSummaryDto,
} from './set-flow-variables.response.dto';

@Injectable()
export class SetFlowVariablesService {
  // В реальной реализации здесь будет работа с базой данных
  // Сейчас используем mock данные для демонстрации структуры
  private mockFlowExecutions = new Map<string, any>();

  constructor() {
    // Инициализируем тестовые данные
    this.initializeMockData();
  }

  async execute(
    flowId: string,
    request: SetFlowVariablesRequestDto,
  ): Promise<SetFlowVariablesResponseDto> {
    const startTime = Date.now();

    try {
      // Валидация входных параметров
      if (!flowId) {
        throw new BadRequestException('Flow ID is required');
      }

      // Проверяем существование flow execution
      const flowExecution = this.mockFlowExecutions.get(flowId);
      if (!flowExecution) {
        throw new NotFoundException(
          `Flow execution with ID ${flowId} not found`,
        );
      }

      // Обработка каждой переменной
      const results: SetVariableResultDto[] = [];
      const summary = this.initializeSummary();

      for (const variable of request.variables) {
        try {
          const result = await this.processVariable(
            flowExecution,
            variable,
            request,
          );
          results.push(result);
          this.updateSummary(summary, result);
        } catch (error) {
          const failedResult: SetVariableResultDto = {
            name: variable.name,
            success: false,
            action: 'failed',
            message: error.message,
            setValue: null,
            previousValue: null,
          };
          results.push(failedResult);
          summary.failed++;
        }
        summary.totalProcessed++;
      }

      // Сохраняем обновленное состояние
      this.mockFlowExecutions.set(flowId, flowExecution);

      // Расчет времени обработки
      const processingTime = Date.now() - startTime;
      summary.processingTime = this.formatProcessingTime(processingTime);

      return new SetFlowVariablesResponseDto(
        results,
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
        `Failed to set flow variables: ${error.message}`,
      );
    }
  }

  private async processVariable(
    flowExecution: any,
    variable: FlowVariableInputDto,
    request: SetFlowVariablesRequestDto,
  ): Promise<SetVariableResultDto> {
    // Валидация типа переменной
    if (request.validateTypes !== false) {
      this.validateVariableType(variable);
    }

    // Поиск существующей переменной
    const existingVariable = this.findExistingVariable(
      flowExecution,
      variable.name,
    );

    if (existingVariable) {
      return this.updateExistingVariable(
        flowExecution,
        existingVariable,
        variable,
        request,
      );
    } else {
      return this.createNewVariable(flowExecution, variable, request);
    }
  }

  private validateVariableType(variable: FlowVariableInputDto): void {
    const { type, value } = variable;

    switch (type) {
      case VariableType.STRING:
        if (typeof value !== 'string') {
          throw new BadRequestException(
            `Variable ${variable.name} must be a string`,
          );
        }
        break;
      case VariableType.NUMBER:
        if (typeof value !== 'number' || isNaN(value)) {
          throw new BadRequestException(
            `Variable ${variable.name} must be a number`,
          );
        }
        break;
      case VariableType.BOOLEAN:
        if (typeof value !== 'boolean') {
          throw new BadRequestException(
            `Variable ${variable.name} must be a boolean`,
          );
        }
        break;
      case VariableType.OBJECT:
        if (
          typeof value !== 'object' ||
          Array.isArray(value) ||
          value === null
        ) {
          throw new BadRequestException(
            `Variable ${variable.name} must be an object`,
          );
        }
        break;
      case VariableType.ARRAY:
        if (!Array.isArray(value)) {
          throw new BadRequestException(
            `Variable ${variable.name} must be an array`,
          );
        }
        break;
    }
  }

  private findExistingVariable(flowExecution: any, name: string) {
    if (!flowExecution.variables) {
      flowExecution.variables = [];
      return null;
    }
    return flowExecution.variables.find((v: any) => v.name === name);
  }

  private updateExistingVariable(
    flowExecution: any,
    existingVariable: any,
    newVariable: FlowVariableInputDto,
    request: SetFlowVariablesRequestDto,
  ): SetVariableResultDto {
    // Проверка read-only переменных
    if (existingVariable.isReadOnly && !request.overwriteReadOnly) {
      return {
        name: newVariable.name,
        success: false,
        action: 'skipped',
        message: 'Variable is read-only',
        setValue: null,
        previousValue: existingVariable.value,
      };
    }

    const previousValue = existingVariable.value;
    let newValue = newVariable.value;

    // Обработка режима обновления
    if (
      request.updateMode === UpdateMode.MERGE &&
      existingVariable.type === VariableType.OBJECT
    ) {
      newValue = { ...existingVariable.value, ...newVariable.value };
    } else if (
      request.updateMode === UpdateMode.APPEND &&
      existingVariable.type === VariableType.ARRAY
    ) {
      newValue = [...existingVariable.value, ...newVariable.value];
    }

    // Обновление переменной
    Object.assign(existingVariable, {
      value: newValue,
      type: newVariable.type,
      scope: newVariable.scope,
      description: newVariable.description || existingVariable.description,
      updatedAt: new Date().toISOString(),
      isReadOnly: newVariable.isReadOnly ?? existingVariable.isReadOnly,
      tags: newVariable.tags || existingVariable.tags,
    });

    return {
      name: newVariable.name,
      success: true,
      action: 'updated',
      message: 'Variable updated successfully',
      setValue: newValue,
      previousValue,
    };
  }

  private createNewVariable(
    flowExecution: any,
    variable: FlowVariableInputDto,
    request: SetFlowVariablesRequestDto,
  ): SetVariableResultDto {
    if (!flowExecution.variables) {
      flowExecution.variables = [];
    }

    const newVariable = {
      name: variable.name,
      value: variable.value,
      type: variable.type,
      scope: variable.scope,
      description: variable.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: request.createdBy || 'system',
      isSystem: false,
      isReadOnly: variable.isReadOnly || false,
      tags: variable.tags || [],
    };

    flowExecution.variables.push(newVariable);

    return {
      name: variable.name,
      success: true,
      action: 'created',
      message: 'Variable created successfully',
      setValue: variable.value,
      previousValue: null,
    };
  }

  private initializeSummary(): SetFlowVariablesSummaryDto {
    return {
      totalProcessed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      processingTime: '00:00:00.000',
    };
  }

  private updateSummary(
    summary: SetFlowVariablesSummaryDto,
    result: SetVariableResultDto,
  ): void {
    switch (result.action) {
      case 'created':
        summary.created++;
        break;
      case 'updated':
        summary.updated++;
        break;
      case 'skipped':
        summary.skipped++;
        break;
      case 'failed':
        summary.failed++;
        break;
    }
  }

  private formatProcessingTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  private initializeMockData() {
    // Тестовые данные для демонстрации
    const mockVariables = [
      {
        name: 'existing_variable',
        value: 'original_value',
        type: VariableType.STRING,
        scope: VariableScope.GLOBAL,
        description: 'Existing variable for testing',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        isSystem: false,
        isReadOnly: false,
        tags: ['test'],
      },
      {
        name: 'readonly_variable',
        value: 'readonly_value',
        type: VariableType.STRING,
        scope: VariableScope.GLOBAL,
        description: 'Read-only variable',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        isSystem: true,
        isReadOnly: true,
        tags: ['readonly', 'system'],
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
      variables: [],
      createdAt: '2024-01-14T15:00:00Z',
    });
  }
}
