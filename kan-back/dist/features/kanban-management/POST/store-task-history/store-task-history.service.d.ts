import { Repository } from 'typeorm';
import { StoreTaskHistoryRequestDto } from './store-task-history.request.dto';
import { StoreTaskHistoryResponseDto } from './store-task-history.response.dto';
import { TaskHistory } from 'kan-back/src/entities/task-history.entity';
export declare class StoreTaskHistoryService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(dto: StoreTaskHistoryRequestDto): Promise<StoreTaskHistoryResponseDto>;
}
