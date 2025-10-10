import { Controller, Post, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadAttachmentService } from './upload-attachment.service';
import { UploadAttachmentRequestDto } from './upload-attachment.request.dto';
import { UploadAttachmentResponseDto } from './upload-attachment.response.dto';
import { ApiUploadAttachment } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('UploadAttachment')
export class UploadAttachmentController {
  constructor(private readonly service: UploadAttachmentService) {}

  @Post(':id/attachments')
  @ApiUploadAttachment()
  async handle(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() requestDto: UploadAttachmentRequestDto,
  ): Promise<UploadAttachmentResponseDto> {
    return this.service.execute(taskId, requestDto);
  }
}
