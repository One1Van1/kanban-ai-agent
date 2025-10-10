import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetColumnTasksRequestDto } from './get-column-tasks.request.dto';
import { GetColumnTasksResponseDto } from './get-column-tasks.response.dto';

@Injectable()
export class GetColumnTasksService extends JiraBaseService {
  async execute(
    requestDto: GetColumnTasksRequestDto,
  ): Promise<GetColumnTasksResponseDto> {
    try {
      let jql = `status = "${requestDto.columnStatus}"`;

      // Добавляем фильтры
      if (requestDto.assignee) {
        jql += ` AND assignee = "${requestDto.assignee}"`;
      }

      if (requestDto.priority) {
        jql += ` AND priority = "${requestDto.priority}"`;
      }

      const result = await this.searchTasks(
        jql,
        0,
        requestDto.maxResults ? parseInt(requestDto.maxResults.toString()) : 50,
      );

      return new GetColumnTasksResponseDto(
        result.issues,
        requestDto.columnStatus,
        result.total,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for column status: ${requestDto.columnStatus}`,
        error.stack,
      );
      throw error;
    }
  }
}
