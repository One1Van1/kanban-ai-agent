import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskQueueService } from './create-task-queue.service';
import {
  CreateTaskQueueRequestDto,
  CreateTaskQueueResponseDto,
} from './create-task-queue.dto';
import { ApiCreateTaskQueue } from './openapi.decorator';

@Controller('queue')
@ApiTags('CreateTaskQueue')
export class CreateTaskQueueController {
  private readonly logger = new Logger(CreateTaskQueueController.name);

  constructor(
    private readonly createTaskQueueService: CreateTaskQueueService,
  ) {}

  @Post('tasks')
  @ApiCreateTaskQueue()
  async handle(
    @Body() requestDto: CreateTaskQueueRequestDto,
  ): Promise<CreateTaskQueueResponseDto> {
    this.logger.log(
      `Received request to add task ${requestDto.taskId} to queue`,
    );
    return this.createTaskQueueService.addTaskToQueue(requestDto);
  }
}
