import { Repository } from 'typeorm';
import { GetTaskHistoryResponseDto } from './get-task-history.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class GetTaskHistoryService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string): Promise<GetTaskHistoryResponseDto>;
}
