import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddTaskCommentService } from './add-task-comment.service';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';
import { ApiAddTaskComment } from './openapi.decorator';

@ApiTags('AddTaskComment')
@Controller('jira')
export class AddTaskCommentController {
  constructor(private readonly addTaskCommentService: AddTaskCommentService) {}

  @Post('tasks/:taskKey/comment')
  @ApiAddTaskComment()
  async handle(
    @Param('taskKey') taskKey: string,
    @Body() requestDto: AddTaskCommentRequestDto,
  ): Promise<AddTaskCommentResponseDto> {
    const result = await this.addTaskCommentService.addCommentToTask(
      taskKey,
      requestDto.comment,
    );

    return new AddTaskCommentResponseDto(
      result.success,
      result.taskKey,
      result.message,
      result.error,
    );
  }
}
