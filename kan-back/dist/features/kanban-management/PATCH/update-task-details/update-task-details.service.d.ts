import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { UpdateTaskDetailsRequestDto } from './update-task-details.request.dto';
import { UpdateTaskDetailsResponseDto } from './update-task-details.response.dto';
export declare class UpdateTaskDetailsService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    updateDetails(taskId: string, requestDto: UpdateTaskDetailsRequestDto): Promise<UpdateTaskDetailsResponseDto>;
    private getCurrentTaskState;
    private validateUpdateRequest;
    private calculateUpdateMetadata;
    private applyUpdates;
    private getTaskVersion;
}
