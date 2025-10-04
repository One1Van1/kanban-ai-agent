import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SearchTasksService } from './search-tasks.service';
import { SearchTasksDto } from './search-tasks.dto';
import { SearchTasksResponse } from './search-tasks.interface';

@ApiTags('search')
@Controller('jira')
export class SearchTasksController {
  constructor(private readonly searchTasksService: SearchTasksService) {}

  /**
   * Поиск задач по JQL
   */
  @Post('search')
  @ApiOperation({
    summary: 'Поиск задач по JQL запросу',
    description:
      'Выполняет поиск задач в Jira используя JQL (Jira Query Language)',
  })
  @ApiBody({
    type: SearchTasksDto,
    examples: {
      basic: {
        summary: 'Базовый поиск',
        value: {
          jql: 'project = "KAN" AND status = "In Progress"',
          maxResults: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Результаты поиска',
    schema: {
      example: {
        issues: [
          {
            key: 'KAN-5',
            fields: {
              summary: 'Название задачи',
              status: { name: 'In Progress' },
            },
          },
        ],
        total: 1,
        maxResults: 10,
      },
    },
  })
  async searchTasks(
    @Body() searchDto: SearchTasksDto,
  ): Promise<SearchTasksResponse> {
    return this.searchTasksService.searchTasksByJql(
      searchDto.jql,
      searchDto.maxResults || 20,
    );
  }
}
