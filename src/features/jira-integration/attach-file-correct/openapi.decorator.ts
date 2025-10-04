import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AttachFileRequestDto } from './attach-file.request.dto';
import { AttachFileResponseDto } from './attach-file.response.dto';

export const ApiAttachFile = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Прикрепить файл к задаче',
      description: 'Прикрепляет файл к указанной задаче в Jira',
    }),
    ApiParam({
      name: 'taskKey',
      description: 'Ключ задачи в Jira',
      example: 'KAN-5',
    }),
    ApiBody({ type: AttachFileRequestDto }),
    ApiOkResponse({
      description: 'Файл успешно прикреплен',
      type: AttachFileResponseDto,
    }),
  );
