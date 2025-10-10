import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from '@/entities/task-history.entity';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';

export class CommentDto {
  @ApiProperty({ example: 'uuid-123', description: 'Comment record ID' })
  id: string;

  @ApiProperty({ example: 'PROJ-123', description: 'Task ID' })
  taskId: string;

  @ApiProperty({
    example: 'Работа над задачей начата. Планирую завершить до конца дня.',
    description: 'Comment text',
  })
  text: string;

  @ApiProperty({ example: 'John Doe', description: 'Comment author name' })
  author: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Comment author email',
  })
  authorEmail: string;

  @ApiProperty({
    example: '2024-10-09T12:00:00Z',
    description: 'Comment creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({ example: 'general', description: 'Comment type' })
  type: string;

  @ApiProperty({ example: 'comment_added', description: 'Action performed' })
  action: string;

  constructor(taskHistory: TaskHistory, commentDto: AddTaskCommentRequestDto) {
    this.id = taskHistory.id;
    this.taskId = taskHistory.taskId;
    this.text = commentDto.comment;
    this.author =
      commentDto.authorName || commentDto.authorEmail || 'Anonymous';
    this.authorEmail = commentDto.authorEmail || '';
    this.createdAt = taskHistory.createdAt;
    this.type = commentDto.context?.commentType || 'general';
    this.action = taskHistory.action;
  }
}

export class AddTaskCommentResponseDto {
  @ApiProperty({ type: CommentDto, description: 'Added comment information' })
  comment: CommentDto;

  @ApiProperty({
    example: true,
    description: 'Whether comment addition was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Comment added successfully to task PROJ-123',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: 'PROJ-123',
    description: 'Task ID the comment was added to',
  })
  taskId: string;

  @ApiProperty({
    example: {
      commentType: 'status_update',
      visibility: 'public',
      wordCount: 15,
    },
    description: 'Additional context about the comment',
  })
  context: Record<string, any>;

  constructor(taskHistory: TaskHistory, commentDto: AddTaskCommentRequestDto) {
    this.comment = new CommentDto(taskHistory, commentDto);
    this.success = true;
    this.message = `Comment added successfully to task ${taskHistory.taskId}`;
    this.taskId = taskHistory.taskId;
    this.context = {
      ...commentDto.context,
      wordCount: commentDto.comment.split(' ').length,
      characterCount: commentDto.comment.length,
      timestamp: new Date().toISOString(),
    };
  }
}
