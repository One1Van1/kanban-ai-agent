import { Controller, Post, Param, Body } from '@nestjs/common';
import { AddTaskCommentService } from './add-task-comment.service';
import { AddTaskCommentDto } from './add-task-comment.dto';
import { AddTaskCommentResponse } from './add-task-comment.interface';

@Controller('jira')
export class AddTaskCommentController {
  constructor(private readonly addTaskCommentService: AddTaskCommentService) {}

  /**
   * Добавить комментарий к задаче
   */
  @Post('tasks/:taskKey/comment')
  async addComment(
    @Param('taskKey') taskKey: string,
    @Body() commentDto: AddTaskCommentDto,
  ): Promise<AddTaskCommentResponse> {
    return this.addTaskCommentService.addCommentToTask(
      taskKey,
      commentDto.comment,
    );
  }
}
