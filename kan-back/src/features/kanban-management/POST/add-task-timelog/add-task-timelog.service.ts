import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddTaskTimelogRequestDto } from './add-task-timelog.request.dto';
import { AddTaskTimelogResponseDto } from './add-task-timelog.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';

@Injectable()
export class AddTaskTimelogService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    requestDto: AddTaskTimelogRequestDto,
  ): Promise<AddTaskTimelogResponseDto> {
    const { description, timeSpentMinutes, startTime, endTime, userId, notes } =
      requestDto;

    // Валидация времени
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      throw new Error('End time must be after start time');
    }

    const actualDurationMs = end.getTime() - start.getTime();
    const actualDurationMinutes = Math.round(actualDurationMs / (1000 * 60));

    // Проверяем, что указанное время соответствует реальной разнице
    if (Math.abs(actualDurationMinutes - timeSpentMinutes) > 5) {
      console.warn(
        `Time mismatch: reported ${timeSpentMinutes}min, actual ${actualDurationMinutes}min`,
      );
    }

    // Создаем запись в истории задач для логирования времени
    const timelogEntry = this.taskHistoryRepository.create({
      taskId,
      taskKey: taskId, // В реальном приложении это должен быть человекочитаемый ключ
      taskTitle: `Time logged for task ${taskId}`,
      action: 'time_logged',
      agentId: userId,
      status: 'completed',
      context: {
        timeSpentMinutes,
        startTime,
        endTime,
        description,
        notes,
        actualDurationMinutes,
      },
      processingTimeMs: timeSpentMinutes * 60 * 1000,
    });

    const savedEntry = await this.taskHistoryRepository.save(timelogEntry);

    // Формируем ответ
    const timelogData = {
      id: savedEntry.id,
      taskId,
      userId,
      description,
      timeSpentMinutes,
      timeSpentHours: Math.round((timeSpentMinutes / 60) * 100) / 100,
      startTime: start,
      endTime: end,
      notes,
      createdAt: savedEntry.createdAt,
    };

    return {
      success: true,
      data: timelogData,
      message: 'Task timelog entry added successfully',
    };
  }
}
