import { Repository } from 'typeorm';
import { DeleteTaskLinkRequestDto } from './delete-task-link.request.dto';
import { DeleteTaskLinkResponseDto } from './delete-task-link.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class DeleteTaskLinkService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, linkId: string, requestDto: DeleteTaskLinkRequestDto): Promise<DeleteTaskLinkResponseDto>;
    private getTaskLinkRecord;
    private extractLinkInfo;
    private getLinkedTaskInfo;
    private validateDeletePermissions;
    private checkTaskLinkPermissions;
    private createDeletionHistoryLog;
    private countRemainingLinks;
}
