import { Controller, Post, Body } from '@nestjs/common';
import { SearchTasksService } from './search-tasks.service';
import { SearchTasksDto } from './search-tasks.dto';
import { SearchTasksResponse } from './search-tasks.interface';

@Controller('jira')
export class SearchTasksController {
  constructor(private readonly searchTasksService: SearchTasksService) {}

  /**
   * Поиск задач по JQL
   */
  @Post('search')
  async searchTasks(
    @Body() searchDto: SearchTasksDto,
  ): Promise<SearchTasksResponse> {
    return this.searchTasksService.searchTasksByJql(
      searchDto.jql,
      searchDto.maxResults || 20,
    );
  }
}
