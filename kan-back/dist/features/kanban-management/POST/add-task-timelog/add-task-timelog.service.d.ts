import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { AddTaskTimelogResponseDto } from './add-task-timelog.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class AddTaskTimelogService {
  private readonly taskHistoryRepository;
  constructor(taskHistoryRepository: Repository<TaskHistory>);
  execute(
    taskId: string,
    requestDto: AddTaskTimelogRequestDto,
  ): Promise<AddTaskTimelogResponseDto>;
}
