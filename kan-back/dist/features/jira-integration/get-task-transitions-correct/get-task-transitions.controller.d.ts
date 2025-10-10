import { GetTaskTransitionsService } from './get-task-transitions.service';
import { GetTaskTransitionsResponseDto } from './get-task-transitions.response.dto';
export declare class GetTaskTransitionsController {
    private readonly service;
    constructor(service: GetTaskTransitionsService);
    handle(taskKey: string): Promise<GetTaskTransitionsResponseDto>;
}
