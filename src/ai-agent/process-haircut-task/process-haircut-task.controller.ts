import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProcessHaircutTaskService } from './process-haircut-task.service';
import { ProcessHaircutTaskDto } from './process-haircut-task.dto';
import { ProcessHaircutTaskResponse } from './process-haircut-task.interface';

@ApiTags('AI Agent - Process Haircut Tasks')
@Controller('ai-agent/process-haircut-task')
export class ProcessHaircutTaskController {
  constructor(
    private readonly processHaircutTaskService: ProcessHaircutTaskService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Полная обработка задач по стрижкам',
    description:
      'Обрабатывает задачу: проверяет время, возвращает в Progress если нужно, или делает AI анализ',
  })
  @ApiResponse({
    status: 200,
    description: 'Задача успешно обработана',
  })
  async processTask(
    @Body() taskData: ProcessHaircutTaskDto,
  ): Promise<ProcessHaircutTaskResponse> {
    return this.processHaircutTaskService.processTask(taskData);
  }
}
