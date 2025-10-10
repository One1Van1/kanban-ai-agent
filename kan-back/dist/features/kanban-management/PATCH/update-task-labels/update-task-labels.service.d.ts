import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { UpdateTaskLabelsRequestDto } from './update-task-labels.request.dto';
import { UpdateTaskLabelsResponseDto } from './update-task-labels.response.dto';
export declare class UpdateTaskLabelsService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, requestDto: UpdateTaskLabelsRequestDto): Promise<UpdateTaskLabelsResponseDto>;
    private validateTaskExists;
    private getCurrentTaskLabels;
    private processLabelOperation;
    private createLabelsHistoryLog;
}
