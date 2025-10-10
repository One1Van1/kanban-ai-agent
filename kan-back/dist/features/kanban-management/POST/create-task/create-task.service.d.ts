import { Repository } from 'typeorm';
import { CreateTaskRequestDto } from './create-task.request.dto';
import { CreateTaskResponseDto } from './create-task.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class CreateTaskService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(createDto: CreateTaskRequestDto): Promise<CreateTaskResponseDto>;
}
