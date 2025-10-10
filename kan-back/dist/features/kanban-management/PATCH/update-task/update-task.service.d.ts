import { Repository } from 'typeorm';
import { UpdateTaskRequestDto } from './update-task.request.dto';
import { UpdateTaskResponseDto } from './update-task.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class UpdateTaskService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    private detectChanges;
    private buildUpdatedContext;
    execute(taskId: string, updateDto: UpdateTaskRequestDto): Promise<UpdateTaskResponseDto>;
}
