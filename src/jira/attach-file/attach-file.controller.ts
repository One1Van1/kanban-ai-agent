import { Controller, Post, Param, Body } from '@nestjs/common';
import { AttachFileService } from './attach-file.service';
import { AttachFileDto } from './attach-file.dto';

@Controller('jira/attach-file')
export class AttachFileController {
  constructor(private readonly attachFileService: AttachFileService) {}

  @Post(':taskKey')
  async attachFile(
    @Param('taskKey') taskKey: string,
    @Body() attachFileDto: AttachFileDto,
  ) {
    if (attachFileDto?.filePath) {
      return this.attachFileService.attachFileFromPath(
        taskKey,
        attachFileDto.filePath,
      );
    } else {
      throw new Error('filePath must be provided');
    }
  }
}
