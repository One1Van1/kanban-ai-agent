import { Controller, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { DeleteTaskAttachmentService } from './delete-task-attachment.service';
import { DeleteTaskAttachmentRequestDto } from './delete-task-attachment.request.dto';
import { DeleteTaskAttachmentResponseDto } from './delete-task-attachment.response.dto';
import { ApiDeleteTaskAttachment } from './delete-task-attachment.openapi.decorator';

@Controller('kanban-management')
export class DeleteTaskAttachmentController {
  constructor(private readonly service: DeleteTaskAttachmentService) {}

  @Delete('task/:taskId/attachment/:attachmentId')
  @ApiDeleteTaskAttachment()
  async deleteAttachment(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Body() requestDto: DeleteTaskAttachmentRequestDto,
  ): Promise<DeleteTaskAttachmentResponseDto> {
    return this.service.deleteAttachment(taskId, attachmentId, requestDto);
  }
}
