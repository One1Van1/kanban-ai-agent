import {
  Controller,
  Post,
  Body,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { WorkflowOrchestratorService } from '../workflow-orchestrator/workflow-orchestrator.service';
import { StatusTransitionService } from '../status-transitions/status-transition.service';
import { JiraWebhookDto } from '../dto/webhook.dto';
import {
  EnhancedTaskStatus,
  WorkflowStatistics,
  EnhancedTaskInfo,
} from '../enhanced-workflow/types';

@Controller('enhanced-workflow')
export class EnhancedWorkflowController {
  private readonly logger = new Logger(EnhancedWorkflowController.name);

  constructor(
    private readonly workflowOrchestrator: WorkflowOrchestratorService,
    private readonly statusTransitionService: StatusTransitionService,
  ) {}

  /**
   * Новый endpoint для приема webhook'ов расширенного workflow
   * Работает параллельно с существующим webhook endpoint
   */
  @Post('webhook/jira')
  async handleEnhancedJiraWebhook(@Body() payload: JiraWebhookDto) {
    this.logger.log(
      `🎯 Enhanced workflow webhook received for ${payload.issue.key}`,
    );

    try {
      await this.workflowOrchestrator.handleJiraWebhook(payload);

      return {
        success: true,
        message: `Enhanced workflow processed task ${payload.issue.key}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`❌ Enhanced workflow error: ${error.message}`);
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Ручное перемещение задачи между статусами
   */
  @Post('transition/:taskKey')
  async manualStatusTransition(
    @Param('taskKey') taskKey: string,
    @Body()
    transitionData: {
      fromStatus: EnhancedTaskStatus;
      toStatus: EnhancedTaskStatus;
      reason: string;
    },
  ) {
    this.logger.log(
      `🔄 Manual transition request for ${taskKey}: ${transitionData.fromStatus} → ${transitionData.toStatus}`,
    );

    try {
      const transition = await this.statusTransitionService.performTransition(
        taskKey,
        transitionData.fromStatus,
        transitionData.toStatus,
        transitionData.reason,
        'user',
      );

      return {
        success: true,
        transition,
        message: `Status transition completed for ${taskKey}`,
      };
    } catch (error) {
      this.logger.error(`❌ Manual transition failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Получить возможные переходы для задачи
   */
  @Get('transitions/:taskKey')
  async getPossibleTransitions(
    @Param('taskKey') taskKey: string,
    @Query('currentStatus') currentStatus: EnhancedTaskStatus,
  ) {
    try {
      const possibleTransitions =
        this.statusTransitionService.getPossibleTransitions(currentStatus);

      return {
        success: true,
        taskKey,
        currentStatus,
        possibleTransitions,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Получить статистику workflow
   */
  @Get('statistics')
  async getWorkflowStatistics(): Promise<{
    success: boolean;
    statistics: WorkflowStatistics;
  }> {
    try {
      const statistics = this.workflowOrchestrator.getWorkflowStatistics();

      return {
        success: true,
        statistics,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to get statistics: ${error.message}`);
      return {
        success: false,
        statistics: {
          totalTasksProcessed: 0,
          autoExecutedTasks: 0,
          tasksNeedingClarification: 0,
          averageExecutionTime: 0,
          successRate: 0,
          lastUpdated: new Date(),
        },
      };
    }
  }

  /**
   * Сбросить статистику workflow
   */
  @Post('statistics/reset')
  async resetStatistics() {
    try {
      this.workflowOrchestrator.resetStatistics();

      return {
        success: true,
        message: 'Workflow statistics have been reset',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Проверка здоровья системы enhanced workflow
   */
  @Get('health')
  async healthCheck() {
    try {
      const healthStatus = await this.workflowOrchestrator.performHealthCheck();

      return {
        success: true,
        ...healthStatus,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`❌ Health check failed: ${error.message}`);
      return {
        success: false,
        status: 'unhealthy',
        details: { error: error.message },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Тестовый endpoint для проверки enhanced workflow
   */
  @Post('test/task')
  async testEnhancedWorkflow(
    @Body()
    testTask: {
      taskKey: string;
      title: string;
      description: string;
      priority?: string;
    },
  ) {
    this.logger.log(
      `🧪 Testing enhanced workflow with task: ${testTask.taskKey}`,
    );

    try {
      // Создаем тестовую информацию о задаче
      const taskInfo: EnhancedTaskInfo = {
        taskKey: testTask.taskKey,
        title: testTask.title,
        description: testTask.description,
        currentStatus: EnhancedTaskStatus.NEW,
        priority: testTask.priority || 'Medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Имитируем обработку через orchestrator
      await this.workflowOrchestrator.handleJiraWebhook({
        webhookEvent: 'jira:issue_created',
        issue: {
          key: testTask.taskKey,
          fields: {
            summary: testTask.title,
            description: testTask.description,
            status: { name: 'New' },
            priority: { name: testTask.priority || 'Medium' },
          },
        },
      } as JiraWebhookDto);

      return {
        success: true,
        message: `Test task ${testTask.taskKey} processed through enhanced workflow`,
        taskInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`❌ Test workflow failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Получить информацию о всех доступных статусах
   */
  @Get('statuses')
  getAvailableStatuses() {
    return {
      success: true,
      statuses: Object.values(EnhancedTaskStatus),
      description: 'All available enhanced workflow statuses',
    };
  }
}
