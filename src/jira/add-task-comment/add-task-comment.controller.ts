import { Controller, Post, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AddTaskCommentService } from './add-task-comment.service';
import { AddTaskCommentDto } from './add-task-comment.dto';
import { AddTaskCommentResponse } from './add-task-comment.interface';

@ApiTags('comments')
@Controller('jira')
export class AddTaskCommentController {
  constructor(private readonly addTaskCommentService: AddTaskCommentService) {}

  /**
   * Добавить комментарий к задаче
   */
  @Post('tasks/:taskKey/comment')
  @ApiOperation({
    summary: 'Добавить комментарий к задаче',
    description: 'Добавляет текстовый комментарий к указанной задаче в Jira',
  })
  @ApiParam({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
  })
  @ApiBody({ type: AddTaskCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно добавлен',
    schema: {
      example: {
        success: true,
        taskKey: 'KAN-5',
        message: 'Comment added successfully',
      },
    },
  })
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
