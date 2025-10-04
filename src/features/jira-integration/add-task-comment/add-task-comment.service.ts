import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { AddTaskCommentResponse } from './add-task-comment.interface';

@Injectable()
export class AddTaskCommentService extends JiraBaseService {
  async addCommentToTask(
    taskKey: string,
    comment: string,
  ): Promise<AddTaskCommentResponse> {
    try {
      // Формируем комментарий в формате ADF для Jira Cloud
      const commentBody = {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment,
                },
              ],
            },
          ],
        },
      };

      await this.addComment(taskKey, commentBody);
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
