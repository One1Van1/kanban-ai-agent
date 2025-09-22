import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RunAutoWorkflowService } from './run-auto-workflow.service';
import { RunAutoWorkflowResponse } from './run-auto-workflow.interface';

@ApiTags('ai-agent')
@Controller('ai-agent')
export class RunAutoWorkflowController {
  constructor(
    private readonly runAutoWorkflowService: RunAutoWorkflowService,
  ) {}

  /**
   * Запустить полный цикл автоматического workflow
   */
  @Post('run-auto-workflow')
  @ApiOperation({
    summary: 'Запустить полный AI workflow',
    description:
      'Выполняет полный цикл: анализ New задач + проверка In Progress задач',
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow выполнен',
    schema: {
      example: {
        timestamp: '2025-09-22T15:30:00.000Z',
        newTasks: { analyzed: 3, moved: 2 },
        progressTasks: { checked: 2, moved: 1 },
        totalMoved: 3,
        duration: 1500,
      },
    },
  })
  async runAutoWorkflow(): Promise<RunAutoWorkflowResponse> {
    return this.runAutoWorkflowService.runAutoWorkflow();
  }
}
