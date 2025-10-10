import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetTaskTimelogRequestDto } from './get-task-timelog.request.dto';
import { GetTaskTimelogResponseDto } from './get-task-timelog.response.dto';
export declare class GetTaskTimelogService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, query: GetTaskTimelogRequestDto): Promise<GetTaskTimelogResponseDto>;
}
