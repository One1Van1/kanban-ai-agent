import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { SearchTasksResponse } from './search-tasks.interface';

@Injectable()
export class SearchTasksService extends JiraBaseService {
  async searchTasksByJql(
    jql: string,
    maxResults: number = 20,
  ): Promise<SearchTasksResponse> {
    try {
      return this.searchTasks(jql, 0, maxResults);
    } catch (error) {
      this.logger.error(
        `Failed to search tasks with JQL "${jql}":`,
        error.message,
      );
      throw error;
    }
  }
}
