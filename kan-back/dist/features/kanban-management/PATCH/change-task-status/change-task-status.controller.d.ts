import { ChangeTaskStatusService } from './change-task-status.service';
import { ChangeTaskStatusRequestDto } from './change-task-status.request.dto';
import { ChangeTaskStatusResponseDto } from './change-task-status.response.dto';
export declare class ChangeTaskStatusController {
    private readonly service;
    constructor(service: ChangeTaskStatusService);
    handle(taskId: string, statusDto: ChangeTaskStatusRequestDto): Promise<ChangeTaskStatusResponseDto>;
}
