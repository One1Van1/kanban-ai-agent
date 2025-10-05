import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FetchExternalContextResponseDto } from './fetch-external-context.response.dto';
import { ExternalSourceType } from './fetch-external-context.query.dto';

export const ApiFetchExternalContext = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить контекст из внешних источников',
      description:
        'Собирает релевантный контекст для задачи из различных внешних источников: Confluence, Slack, GitHub, документации, базы знаний и других систем',
    }),
    ApiParam({
      name: 'taskId',
      description:
        'Уникальный идентификатор задачи для которой собирается контекст',
      example: 'task-uuid-123',
    }),
    ApiQuery({
      name: 'sources',
      enum: ExternalSourceType,
      isArray: true,
      description: 'Список типов внешних источников для поиска контекста',
      required: false,
    }),
    ApiQuery({
      name: 'keywords',
      description: 'Ключевые слова для поиска в внешних источниках',
      isArray: true,
      required: false,
    }),
    ApiQuery({
      name: 'searchDepthDays',
      description: 'Глубина поиска в днях (насколько далеко искать в истории)',
      example: 30,
      required: false,
    }),
    ApiQuery({
      name: 'includeRelatedProjects',
      description: 'Включить контекст из связанных проектов',
      example: true,
      required: false,
    }),
    ApiQuery({
      name: 'maxResultsPerSource',
      description: 'Максимальное количество результатов с каждого источника',
      example: 5,
      required: false,
    }),
    ApiOkResponse({
      description: 'Контекст из внешних источников успешно собран',
      type: FetchExternalContextResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный формат параметров запроса',
    }),
    ApiNotFoundResponse({
      description:
        'Задача не найдена или недостаточно данных для поиска контекста',
    }),
  );
