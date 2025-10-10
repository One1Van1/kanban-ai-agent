import { Repository } from 'typeorm';
import { GetTaskDetailsResponseDto } from './get-task-details.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class GetTaskDetailsService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: number): Promise<GetTaskDetailsResponseDto>;
}
