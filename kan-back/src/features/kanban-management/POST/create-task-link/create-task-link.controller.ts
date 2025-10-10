import { Controller, Post, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskLinkService } from './create-task-link.service';
import { CreateTaskLinkRequestDto } from './create-task-link.request.dto';
import { CreateTaskLinkResponseDto } from './create-task-link.response.dto';
import { ApiCreateTaskLink } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('CreateTaskLink')
export class CreateTaskLinkController {
  constructor(private readonly service: CreateTaskLinkService) {}

  @Post(':id/links')
  @ApiCreateTaskLink()
  async handle(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() requestDto: CreateTaskLinkRequestDto,
  ): Promise<CreateTaskLinkResponseDto> {
    return this.service.execute(taskId, requestDto);
  }
}
