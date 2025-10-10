import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { CreateTaskLinkRequestDto } from './create-task-link.request.dto';
import { CreateTaskLinkResponseDto } from './create-task-link.response.dto';
export declare class CreateTaskLinkService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(sourceTaskId: string, requestDto: CreateTaskLinkRequestDto): Promise<CreateTaskLinkResponseDto>;
    private checkExistingLink;
    private getReverseLinkType;
}
