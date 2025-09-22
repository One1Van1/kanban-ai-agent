import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../shared/jira-base.service';
import { AddTaskCommentResponse } from './add-task-comment.interface';

@Injectable()
export class AddTaskCommentService extends JiraBaseService {
  async addCommentToTask(
    taskKey: string,
    comment: string,
  ): Promise<AddTaskCommentResponse> {
    try {
      await this.addComment(taskKey, { body: comment });
      this.logger.log(`Comment added to task ${taskKey}`);
      return {
        success: true,
        taskKey,
        message: 'Comment added successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to add comment to task ${taskKey}:`,
        error.message,
      );
      return {
        success: false,
        taskKey,
        message: 'Failed to add comment',
        error: error.message,
      };
    }
  }
}
