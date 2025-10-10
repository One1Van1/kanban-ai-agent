import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskHistoryService } from './get-task-history.service';
import { GetTaskHistoryResponseDto } from './get-task-history.response.dto';
import { ApiGetTaskHistory } from './openapi.decorator';

@Controller('database/task-history')
@ApiTags('GetTaskHistory')
export class GetTaskHistoryController {
  constructor(private readonly service: GetTaskHistoryService) {}

  @Get('task/:taskId')
  @ApiGetTaskHistory()
  async handle(
    @Param('taskId') taskId: string,
  ): Promise<GetTaskHistoryResponseDto> {
    return this.service.execute(taskId);
  }
}
