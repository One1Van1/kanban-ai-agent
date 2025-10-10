import { Repository } from 'typeorm';
import { GetTaskStatisticsQueryDto } from './get-task-statistics.request.dto';
import { GetTaskStatisticsResponseDto } from './get-task-statistics.response.dto';
import { TaskHistory } from 'kan-back/src/entities/task-history.entity';
export declare class GetTaskStatisticsService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(query: GetTaskStatisticsQueryDto): Promise<GetTaskStatisticsResponseDto>;
}
