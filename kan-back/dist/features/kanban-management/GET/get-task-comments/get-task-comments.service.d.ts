import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetTaskCommentsRequestDto } from './get-task-comments.request.dto';
import { GetTaskCommentsResponseDto } from './get-task-comments.response.dto';
export declare class GetTaskCommentsService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, query: GetTaskCommentsRequestDto): Promise<GetTaskCommentsResponseDto>;
}
