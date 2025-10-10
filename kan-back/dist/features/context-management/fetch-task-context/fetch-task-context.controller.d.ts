import { FetchTaskContextService } from './fetch-task-context.service';
import { FetchTaskContextResponseDto } from './fetch-task-context.response.dto';
export declare class FetchTaskContextController {
    private readonly service;
    constructor(service: FetchTaskContextService);
    handle(taskId: string): Promise<FetchTaskContextResponseDto>;
}
