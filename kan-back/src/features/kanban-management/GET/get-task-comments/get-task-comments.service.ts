import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { GetTaskCommentsRequestDto } from './get-task-comments.request.dto';
import { GetTaskCommentsResponseDto } from './get-task-comments.response.dto';

@Injectable()
export class GetTaskCommentsService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    query: GetTaskCommentsRequestDto,
  ): Promise<GetTaskCommentsResponseDto> {
    const { page = 1, limit = 20, sortOrder = 'DESC' } = query;

    // Получаем комментарии из истории задач (где action = 'comment_added')
    const [comments, total] = await this.taskHistoryRepository.findAndCount({
      where: {
        taskId,
        action: 'comment_added',
      },
      order: {
        createdAt: sortOrder,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    // Преобразуем историю в комментарии
    const items = comments.map((history) => ({
      id: history.id,
      taskId: history.taskId,
      content: history.executedInstruction || `Action: ${history.action}`,
      authorId: history.agentId,
      createdAt: history.createdAt,
      updatedAt: history.createdAt,
    }));

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Task comments retrieved successfully',
    };
  }
}
