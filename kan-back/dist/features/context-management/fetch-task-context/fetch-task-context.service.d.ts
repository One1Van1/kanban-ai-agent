import { FetchTaskContextResponseDto } from './fetch-task-context.response.dto';
export declare class FetchTaskContextService {
    execute(taskId: string): Promise<FetchTaskContextResponseDto>;
}
