import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { GetTaskTimelogRequestDto } from './get-task-timelog.request.dto';
import { GetTaskTimelogResponseDto } from './get-task-timelog.response.dto';

@Injectable()
export class GetTaskTimelogService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    query: GetTaskTimelogRequestDto,
  ): Promise<GetTaskTimelogResponseDto> {
    const { page = 1, limit = 20, fromDate, toDate } = query;

    // Для демонстрации создаем мок-данные лога времени
    // В реальной реализации это могло бы быть отдельной таблицей или полем в TaskHistory
    const mockTimelogEntries = [
      {
        id: '1',
        taskId,
        userId: 'agent-001',
        description: 'Initial analysis and planning',
        timeSpentMinutes: 120,
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        createdAt: new Date('2024-01-15T11:00:00Z'),
      },
      {
        id: '2',
        taskId,
        userId: 'agent-001',
        description: 'Implementation of core features',
        timeSpentMinutes: 180,
        startTime: new Date('2024-01-15T14:00:00Z'),
        endTime: new Date('2024-01-15T17:00:00Z'),
        createdAt: new Date('2024-01-15T17:00:00Z'),
      },
      {
        id: '3',
        taskId,
        userId: 'agent-002',
        description: 'Code review and testing',
        timeSpentMinutes: 90,
        startTime: new Date('2024-01-16T10:00:00Z'),
        endTime: new Date('2024-01-16T11:30:00Z'),
        createdAt: new Date('2024-01-16T11:30:00Z'),
      },
    ];

    // Фильтрация по датам
    let filteredEntries = mockTimelogEntries;
    if (fromDate || toDate) {
      filteredEntries = mockTimelogEntries.filter((entry) => {
        const entryDate = entry.createdAt;
        if (fromDate && entryDate < new Date(fromDate)) return false;
        if (toDate && entryDate > new Date(toDate)) return false;
        return true;
      });
    }

    // Пагинация
    const total = filteredEntries.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredEntries.slice(startIndex, endIndex);

    // Расчет общего времени
    const totalTimeSpent = filteredEntries.reduce(
      (sum, entry) => sum + entry.timeSpentMinutes,
      0,
    );
    const avgTimePerEntry =
      filteredEntries.length > 0 ? totalTimeSpent / filteredEntries.length : 0;

    return {
      success: true,
      data: {
        taskId,
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        summary: {
          totalTimeSpentMinutes: totalTimeSpent,
          totalTimeSpentHours: Math.round((totalTimeSpent / 60) * 100) / 100,
          averageTimePerEntry: Math.round(avgTimePerEntry),
          totalEntries: total,
          uniqueUsers: [...new Set(filteredEntries.map((e) => e.userId))]
            .length,
        },
      },
      message: 'Task timelog retrieved successfully',
    };
  }
}
