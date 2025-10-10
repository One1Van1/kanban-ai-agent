import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddTaskCommentService } from './add-task-comment.service';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';
import { ApiAddTaskComment } from './openapi.decorator';

@Controller('kanban/tasks')
@ApiTags('AddTaskComment')
export class AddTaskCommentController {
  constructor(private readonly service: AddTaskCommentService) {}

  @Post(':id/comments')
  @ApiAddTaskComment()
  async handle(
    @Param('id') taskId: string,
    @Body() commentDto: AddTaskCommentRequestDto,
  ): Promise<AddTaskCommentResponseDto> {
    return this.service.execute(taskId, commentDto);
  }
}
