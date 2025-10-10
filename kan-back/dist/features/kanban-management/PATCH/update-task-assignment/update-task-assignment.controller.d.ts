import { UpdateTaskAssignmentService } from './update-task-assignment.service';
import { UpdateTaskAssignmentRequestDto } from './update-task-assignment.request.dto';
import { UpdateTaskAssignmentResponseDto } from './update-task-assignment.response.dto';
export declare class UpdateTaskAssignmentController {
    private readonly service;
    constructor(service: UpdateTaskAssignmentService);
    updateAssignment(taskId: string, requestDto: UpdateTaskAssignmentRequestDto): Promise<UpdateTaskAssignmentResponseDto>;
}
