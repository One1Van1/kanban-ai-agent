import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTaskTransitionsService } from './get-task-transitions.service';
import { GetTaskTransitionsRequestDto } from './get-task-transitions.request.dto';
import { GetTaskTransitionsResponseDto } from './get-task-transitions.response.dto';
import { ApiGetTaskTransitions } from './openapi.decorator';

@Controller('jira/tasks')
@ApiTags('GetTaskTransitions')
export class GetTaskTransitionsController {
  constructor(private readonly service: GetTaskTransitionsService) {}

  @Get(':taskKey/transitions')
  @ApiGetTaskTransitions()
  async handle(
    @Param('taskKey') taskKey: string,
  ): Promise<GetTaskTransitionsResponseDto> {
    const requestDto = new GetTaskTransitionsRequestDto();
    requestDto.taskKey = taskKey;

    return this.service.execute(requestDto);
  }
}
