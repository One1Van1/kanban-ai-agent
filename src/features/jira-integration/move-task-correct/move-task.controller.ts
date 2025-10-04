import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoveTaskService } from './move-task.service';
import { MoveTaskRequestDto } from './move-task.request.dto';
import { MoveTaskResponseDto } from './move-task.response.dto';
import { ApiMoveTask } from './openapi.decorator';

@Controller('jira')
@ApiTags('MoveTask')
export class MoveTaskController {
  constructor(private readonly service: MoveTaskService) {}

  @Post('tasks/:taskKey/move')
  @ApiMoveTask()
  async handle(
    @Param('taskKey') taskKey: string,
    @Body() requestDto: MoveTaskRequestDto,
  ): Promise<MoveTaskResponseDto> {
    return this.service.execute(taskKey, requestDto);
  }
}
