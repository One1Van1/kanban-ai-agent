import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { SearchTasksRequestDto } from './search-tasks.request.dto';
import { SearchTasksResponseDto } from './search-tasks.response.dto';

@Injectable()
export class SearchTasksService extends JiraBaseService {
  async execute(
    requestDto: SearchTasksRequestDto,
  ): Promise<SearchTasksResponseDto> {
    try {
      const result = await this.searchTasks(
        requestDto.jql,
        requestDto.startAt || 0,
        requestDto.maxResults || 20,
      );

      return new SearchTasksResponseDto(
        result.issues,
        result.total,
        result.startAt,
        result.maxResults,
      );
    } catch (error) {
      this.logger.error(
        `Failed to search tasks with JQL: ${requestDto.jql}`,
        error.stack,
      );
      throw error;
    }
  }
}
