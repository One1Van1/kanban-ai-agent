import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateTaskRequestDto } from './create-task.request.dto';
import { CreateTaskResponseDto } from './create-task.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';

@Injectable()
export class CreateTaskService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    createDto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    // Проверяем, что задача с таким ключом не существует
    const existingTask = await this.taskHistoryRepository.findOne({
      where: { taskKey: createDto.taskKey },
    });

    if (existingTask) {
      throw new ConflictException(
        `Task with key ${createDto.taskKey} already exists`,
      );
    }

    // Создаем новую запись в истории задач
    const taskHistory = this.taskHistoryRepository.create({
      taskId: createDto.taskKey, // Используем taskKey как taskId для новых задач
      taskKey: createDto.taskKey,
      taskTitle: createDto.taskTitle,
      action: 'created',
      toColumn: createDto.initialColumn,
      toStatus: createDto.initialStatus || 'pending',
      status: 'completed', // Статус выполнения записи в истории
      context: createDto.context || {},
      agentId: createDto.agentId || 'system', // Используем 'system' если агент не указан
      agentResponse: {
        success: true,
        message: 'Task created successfully',
        timestamp: new Date().toISOString(),
      },
    });

    const savedTask = await this.taskHistoryRepository.save(taskHistory);

    return new CreateTaskResponseDto(savedTask);
  }
}
