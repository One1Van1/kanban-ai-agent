import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { UpdateTaskAssignmentRequestDto } from './update-task-assignment.request.dto';
import { UpdateTaskAssignmentResponseDto } from './update-task-assignment.response.dto';
export declare class UpdateTaskAssignmentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    updateAssignment(taskId: string, requestDto: UpdateTaskAssignmentRequestDto): Promise<UpdateTaskAssignmentResponseDto>;
    private getCurrentTaskState;
    private validateAssignmentRequest;
    private calculateAssignmentChanges;
    private applyAssignmentUpdates;
    private getAssignmentVersion;
}
