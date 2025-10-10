import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetUserActivityRequestDto } from './get-user-activity.request.dto';
import { GetUserActivityResponseDto } from './get-user-activity.response.dto';

@Injectable()
export class GetUserActivityService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    userId: string,
    query: GetUserActivityRequestDto,
  ): Promise<GetUserActivityResponseDto> {
    const { page = 1, limit = 20, type } = query;

    // Получаем активность пользователя из истории задач
    const whereCondition: any = { agentId: userId };

    if (type && type !== 'all') {
      whereCondition.action = type;
    }

    const [activities, total] = await this.taskHistoryRepository.findAndCount({
      where: whereCondition,
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    // Преобразуем историю в активность
    const items = activities.map((history) => ({
      id: history.id,
      type: history.action,
      taskId: history.taskId,
      taskTitle: history.taskTitle,
      description: this.getActivityDescription(history),
      timestamp: history.createdAt,
      details: {
        fromStatus: history.fromStatus,
        toStatus: history.toStatus,
        fromColumn: history.fromColumn,
        toColumn: history.toColumn,
      },
    }));

    return {
      success: true,
      data: {
        userId,
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'User activity retrieved successfully',
    };
  }

  private getActivityDescription(history: TaskHistory): string {
    switch (history.action) {
      case 'created':
        return `Created task "${history.taskTitle}"`;
      case 'updated':
        return `Updated task "${history.taskTitle}"`;
      case 'assigned':
        return `Was assigned to task "${history.taskTitle}"`;
      case 'status_changed':
        return `Changed status of "${history.taskTitle}" from ${history.fromStatus} to ${history.toStatus}`;
      case 'comment_added':
        return `Added comment to "${history.taskTitle}"`;
      default:
        return `Performed action "${history.action}" on "${history.taskTitle}"`;
    }
  }
}
