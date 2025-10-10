import { GetTasksByColumnService } from './get-tasks-by-column.service';
import { GetTasksByColumnQueryDto } from './get-tasks-by-column.query.dto';
import { GetTasksByColumnResponseDto } from './get-tasks-by-column.response.dto';
export declare class GetTasksByColumnController {
    private readonly service;
    constructor(service: GetTasksByColumnService);
    handle(column: string, query: GetTasksByColumnQueryDto): Promise<GetTasksByColumnResponseDto>;
}
