import { Controller, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteTaskLinkService } from './delete-task-link.service';
import { DeleteTaskLinkRequestDto } from './delete-task-link.request.dto';
import { DeleteTaskLinkResponseDto } from './delete-task-link.response.dto';
import { ApiDeleteTaskLink } from './delete-task-link.openapi.decorator';

@Controller('kanban-management')
@ApiTags('DeleteTaskLink')
export class DeleteTaskLinkController {
  constructor(private readonly service: DeleteTaskLinkService) {}

  @Delete('task/:taskId/link/:linkId')
  @ApiDeleteTaskLink()
  async handle(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @Body() requestDto: DeleteTaskLinkRequestDto,
  ): Promise<DeleteTaskLinkResponseDto> {
    return this.service.execute(taskId, linkId, requestDto);
  }
}
