import { Controller, Post, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecuteTaskTransitionService } from './execute-task-transition.service';
import { ExecuteTaskTransitionRequestDto } from './execute-task-transition.request.dto';
import { ExecuteTaskTransitionResponseDto } from './execute-task-transition.response.dto';
import { ExecuteTaskTransitionOpenApi } from './execute-task-transition.openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('ExecuteTaskTransition')
export class ExecuteTaskTransitionController {
  constructor(private readonly service: ExecuteTaskTransitionService) {}

  @Post(':id/transition')
  @ExecuteTaskTransitionOpenApi()
  async executeTransition(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() requestDto: ExecuteTaskTransitionRequestDto,
  ): Promise<ExecuteTaskTransitionResponseDto> {
    return this.service.executeTransition(taskId, requestDto);
  }
}
