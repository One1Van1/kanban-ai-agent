import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DeleteTaskRequestDto } from './delete-task.request.dto';
import { DeleteTaskResponseDto } from './delete-task.response.dto';
export declare class DeleteTaskService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    deleteTask(taskId: string, requestDto: DeleteTaskRequestDto): Promise<DeleteTaskResponseDto>;
    private getCurrentTaskState;
    private validateDeletionRequest;
    private getTaskMetadata;
    private checkTaskDependencies;
    private performDeletion;
    private softDeleteTask;
    private hardDeleteTask;
    private archiveTask;
    private deleteTaskAttachments;
    private deleteTaskComments;
    private getRelatedTasks;
    private getTasksBlockedByThisTask;
    private getLinkedTasks;
    private notifyUsersAboutDeletion;
    private createDeletionHistoryLog;
    private calculateRestorationDeadline;
}
