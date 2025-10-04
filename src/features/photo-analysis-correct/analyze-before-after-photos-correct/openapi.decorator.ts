import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AnalyzeBeforeAfterPhotosRequestDto } from './analyze-before-after-photos.request.dto';
import { AnalyzeBeforeAfterPhotosResponseDto } from './analyze-before-after-photos.response.dto';

export const ApiAnalyzeBeforeAfterPhotos = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Анализ фото до и после стрижки',
      description:
        'Анализирует фотографии до и после стрижки с помощью ИИ и оценивает качество работы',
    }),
    ApiBody({ type: AnalyzeBeforeAfterPhotosRequestDto }),
    ApiOkResponse({
      description: 'Результат анализа фотографий',
      type: AnalyzeBeforeAfterPhotosResponseDto,
    }),
  );
