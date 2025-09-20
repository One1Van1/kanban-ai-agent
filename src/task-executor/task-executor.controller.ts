import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TaskExecutorService } from './task-executor.service';
import {
  TaskExecutionPlan,
  ActionType,
} from './interfaces/execution.interface';

@Controller('task-executor')
export class TaskExecutorController {
  private readonly logger = new Logger(TaskExecutorController.name);

  constructor(private readonly taskExecutorService: TaskExecutorService) {}

  /**
   * Демонстрационный endpoint для тестирования AI Executor
   */
  @Post('demo/create-entity')
  async demoCreateEntity(
    @Body() body: { entityName: string; description?: string },
  ) {
    this.logger.log(`🎯 Demo: Creating entity "${body.entityName}"`);

    try {
      // Создаем план выполнения для создания сущности
      const plan: TaskExecutionPlan = {
        taskKey: 'DEMO-001',
        summary: `Create ${body.entityName} entity`,
        description:
          body.description ||
          `Auto-generated ${body.entityName} entity with basic CRUD operations`,
        actions: [
          {
            type: ActionType.CREATE_ENTITY,
            description: `Generate ${body.entityName} entity with TypeORM`,
            entityName: body.entityName,
          },
          {
            type: ActionType.CREATE_SERVICE,
            description: `Generate ${body.entityName} service`,
            entityName: body.entityName,
          },
          {
            type: ActionType.CREATE_CONTROLLER,
            description: `Generate ${body.entityName} controller`,
            entityName: body.entityName,
          },
        ],
        expectedResult: `Complete NestJS resource for ${body.entityName}`,
      };

      // Выполняем план
      const results = await this.taskExecutorService.executeTask(plan);

      return {
        success: true,
        message: `Entity "${body.entityName}" created successfully`,
        executionResults: results,
        createdFiles: results
          .filter((r) => r.success && r.files)
          .flatMap((r) => r.files),
      };
    } catch (error) {
      this.logger.error(`❌ Demo failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
        error: error.stack,
      };
    }
  }

  /**
   * Анализ задачи на возможность выполнения
   */
  @Post('analyze')
  async analyzeTask(@Body() body: { summary: string; description: string }) {
    this.logger.log(`🔍 Analyzing task: "${body.summary}"`);

    const plan = this.taskExecutorService.analyzeTaskForExecution(
      'ANALYZE-001',
      body.summary,
      body.description,
    );

    return {
      executable: !!plan,
      plan: plan,
    };
  }
}
