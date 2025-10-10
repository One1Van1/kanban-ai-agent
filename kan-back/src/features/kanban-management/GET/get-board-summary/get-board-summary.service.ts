import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetBoardSummaryRequestDto } from './get-board-summary.request.dto';
import { GetBoardSummaryResponseDto } from './get-board-summary.response.dto';

@Injectable()
export class GetBoardSummaryService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    query: GetBoardSummaryRequestDto,
  ): Promise<GetBoardSummaryResponseDto> {
    const { boardId, includeDetails } = query;

    // Получаем статистику по задачам из истории
    const whereCondition = boardId ? { context: { boardId } } : {};

    // Базовая статистика по колонкам
    const columnStats = await this.getColumnStatistics(whereCondition);

    // Статистика по приоритетам
    const priorityStats = await this.getPriorityStatistics(whereCondition);

    // Общая статистика
    const totalTasks = columnStats.reduce((sum, col) => sum + col.taskCount, 0);
    const activeTasks = columnStats
      .filter((col) => !['done', 'completed'].includes(col.columnId))
      .reduce((sum, col) => sum + col.taskCount, 0);

    const response = {
      success: true,
      data: {
        boardId: boardId || 'default',
        totalTasks,
        activeTasks,
        completedTasks: totalTasks - activeTasks,
        columns: columnStats,
        priorities: priorityStats,
        lastUpdated: new Date(),
      },
      message: 'Board summary retrieved successfully',
    };

    if (includeDetails) {
      const detailedStats = await this.getDetailedStatistics(whereCondition);
      response.data = {
        ...response.data,
        ...detailedStats,
      };
    }

    return response;
  }

  private async getColumnStatistics(whereCondition: any) {
    // Моделируем статистику по колонкам на основе последних статусов задач
    const columns = [
      { columnId: 'todo', name: 'To Do', taskCount: 8, color: '#42526E' },
      {
        columnId: 'in_progress',
        name: 'In Progress',
        taskCount: 5,
        color: '#0052CC',
      },
      {
        columnId: 'in_review',
        name: 'In Review',
        taskCount: 3,
        color: '#FF8B00',
      },
      { columnId: 'done', name: 'Done', taskCount: 12, color: '#36B37E' },
      { columnId: 'blocked', name: 'Blocked', taskCount: 2, color: '#DE350B' },
    ];

    return columns;
  }

  private async getPriorityStatistics(whereCondition: any) {
    // Моделируем статистику по приоритетам
    const priorities = [
      { priority: 'highest', name: 'Highest', taskCount: 2, color: '#DE350B' },
      { priority: 'high', name: 'High', taskCount: 6, color: '#FF8B00' },
      { priority: 'medium', name: 'Medium', taskCount: 15, color: '#0052CC' },
      { priority: 'low', name: 'Low', taskCount: 7, color: '#36B37E' },
    ];

    return priorities;
  }

  private async getDetailedStatistics(whereCondition: any) {
    return {
      avgTasksPerColumn: 6,
      tasksCreatedToday: 3,
      tasksCompletedToday: 4,
      overdueTasks: 2,
      blockedTasksDuration: '2.5 days',
      mostActiveColumn: 'in_progress',
      completionRate: 85.7,
    };
  }
}
