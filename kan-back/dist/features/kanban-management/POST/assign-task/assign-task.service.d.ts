import { Repository } from 'typeorm';
import { AssignTaskRequestDto } from './assign-task.request.dto';
import { AssignTaskResponseDto } from './assign-task.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class AssignTaskService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, assignDto: AssignTaskRequestDto): Promise<AssignTaskResponseDto>;
}
