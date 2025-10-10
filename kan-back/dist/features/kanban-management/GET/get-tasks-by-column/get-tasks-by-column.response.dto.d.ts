import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetTasksByColumnQueryDto } from './get-tasks-by-column.query.dto';
export declare class ColumnTaskDto {
    taskId: string;
    taskKey: string;
    taskTitle: string;
    status: string;
    currentColumn: string;
    lastUpdated: Date;
    lastAction: string;
    constructor(taskHistory: TaskHistory);
}
export declare class GetTasksByColumnResponseDto {
    tasks: ColumnTaskDto[];
    column: string;
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    constructor(taskHistories: TaskHistory[], total: number, column: string, query: GetTasksByColumnQueryDto);
}
