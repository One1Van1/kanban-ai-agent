import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskService } from './get-task.service';
import { GetTaskResponseDto } from './get-task.response.dto';
import { ApiGetTask } from './openapi.decorator';

@Controller('jira')
@ApiTags('GetTask')
export class GetTaskController {
  constructor(private readonly service: GetTaskService) {}

  @Get('tasks/:taskKey')
  @ApiGetTask()
  async handle(@Param('taskKey') taskKey: string): Promise<GetTaskResponseDto> {
    return this.service.execute(taskKey);
  }
}
