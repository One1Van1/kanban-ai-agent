import { Repository } from 'typeorm';
import { ChangeTaskStatusRequestDto } from './change-task-status.request.dto';
import { ChangeTaskStatusResponseDto } from './change-task-status.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class ChangeTaskStatusService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    private readonly allowedStatusTransitions;
    private isValidStatusTransition;
    private calculateTimeInStatus;
    execute(taskId: string, statusDto: ChangeTaskStatusRequestDto): Promise<ChangeTaskStatusResponseDto>;
}
