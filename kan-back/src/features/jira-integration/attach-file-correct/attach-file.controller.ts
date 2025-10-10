import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachFileService } from './attach-file.service';
import { AttachFileRequestDto } from './attach-file.request.dto';
import { AttachFileResponseDto } from './attach-file.response.dto';
import { ApiAttachFile } from './openapi.decorator';

@Controller('jira/attach-file')
@ApiTags('AttachFile')
export class AttachFileController {
  constructor(private readonly service: AttachFileService) {}

  @Post(':taskKey')
  @ApiAttachFile()
  async handle(
    @Param('taskKey') taskKey: string,
    @Body() requestDto: AttachFileRequestDto,
  ): Promise<AttachFileResponseDto> {
    return this.service.execute(taskKey, requestDto);
  }
}
