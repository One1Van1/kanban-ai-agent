import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Res,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DownloadAttachmentService } from './download-attachment.service';
import { DownloadAttachmentQueryDto } from './download-attachment.query.dto';
import { ApiDownloadAttachment } from './download-attachment.openapi.decorator';

@Controller('kanban-management')
@ApiTags('DownloadAttachment')
export class DownloadAttachmentController {
  constructor(private readonly service: DownloadAttachmentService) {}

  @Get('attachment/:attachmentId/download')
  @ApiDownloadAttachment()
  async handle(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Query() query: DownloadAttachmentQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    return this.service.execute(attachmentId, query, res);
  }
}
