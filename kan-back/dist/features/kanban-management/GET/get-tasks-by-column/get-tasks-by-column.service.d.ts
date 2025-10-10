import { Repository } from 'typeorm';
import { GetTasksByColumnQueryDto } from './get-tasks-by-column.query.dto';
import { GetTasksByColumnResponseDto } from './get-tasks-by-column.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class GetTasksByColumnService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(column: string, query: GetTasksByColumnQueryDto): Promise<GetTasksByColumnResponseDto>;
}
