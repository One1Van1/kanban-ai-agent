import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
@Injectable()
export class AddTaskCommentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    commentDto: AddTaskCommentRequestDto,
  ): Promise<AddTaskCommentResponseDto> {
    // Проверяем, что задача существует
    const existingTask = await this.taskHistoryRepository.findOne({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Создаем запись о добавлении комментария
    const commentHistory = this.taskHistoryRepository.create({
      taskId: taskId,
      taskKey: existingTask.taskKey,
      taskTitle: existingTask.taskTitle,
      action: 'comment_added',
      // Сохраняем текущее состояние задачи
      fromColumn: existingTask.toColumn,
      toColumn: existingTask.toColumn,
      fromStatus: existingTask.toStatus,
      toStatus: existingTask.toStatus,
      status: 'completed', // Статус выполнения операции
      context: {
        ...existingTask.context,
        ...commentDto.context,
        comment: {
          text: commentDto.comment,
          author:
            commentDto.authorName || commentDto.authorEmail || 'Anonymous',
          authorEmail: commentDto.authorEmail || '',
          timestamp: new Date().toISOString(),
          type: commentDto.context?.commentType || 'general',
        },
      },
      agentId: commentDto.agentId || existingTask.agentId || 'system',
      agentResponse: {
        success: true,
        message: `Comment added to task ${taskId}`,
        timestamp: new Date().toISOString(),
        triggerType: commentDto.triggerType || 'manual',
        commentLength: commentDto.comment.length,
      },
    });

    const savedComment = await this.taskHistoryRepository.save(commentHistory);

    return new AddTaskCommentResponseDto(savedComment, commentDto);
  }
}
