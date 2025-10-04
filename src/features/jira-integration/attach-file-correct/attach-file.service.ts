import { Injectable } from '@nestjs/common';
import { AttachFileRequestDto } from './attach-file.request.dto';
import { AttachFileResponseDto } from './attach-file.response.dto';

@Injectable()
export class AttachFileService {
  async execute(
    taskKey: string,
    requestDto: AttachFileRequestDto,
  ): Promise<AttachFileResponseDto> {
    try {
      // Логика прикрепления файла к Jira
      // TODO: Реализовать интеграцию с Jira API

      return new AttachFileResponseDto(
        true,
        taskKey,
        'File attached successfully',
      );
    } catch (error) {
      return new AttachFileResponseDto(
        false,
        taskKey,
        'Failed to attach file',
        error.message,
      );
    }
  }
}
