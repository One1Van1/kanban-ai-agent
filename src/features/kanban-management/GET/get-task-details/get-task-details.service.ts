import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetTaskDetailsResponseDto } from './get-task-details.response.dto';

// Импортируем существующие сущности
import { TaskHistory } from '../../../../entities/task-history.entity';

@Injectable()
export class GetTaskDetailsService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(taskId: number): Promise<GetTaskDetailsResponseDto> {
    // Ищем последнюю запись о задаче в истории (самые актуальные данные)
    const latestTaskRecord = await this.taskHistoryRepository.findOne({
      where: { taskId: taskId.toString() },
      order: { createdAt: 'DESC' },
    });

    if (!latestTaskRecord) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Получаем всю историю задачи для дополнительной информации
    const taskHistory = await this.taskHistoryRepository.find({
      where: { taskId: taskId.toString() },
      order: { createdAt: 'DESC' },
      take: 10, // Последние 10 изменений
    });

    return new GetTaskDetailsResponseDto(latestTaskRecord, taskHistory);
  }
}
