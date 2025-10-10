import { Repository } from 'typeorm';
import { MoveTaskRequestDto } from './move-task-request.dto';
import { MoveTaskResponseDto } from './move-task-response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class MoveTaskToColumnService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, moveDto: MoveTaskRequestDto): Promise<MoveTaskResponseDto>;
}
