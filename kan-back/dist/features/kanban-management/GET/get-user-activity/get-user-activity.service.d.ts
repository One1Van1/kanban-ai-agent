import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { GetUserActivityRequestDto } from './get-user-activity.request.dto';
import { GetUserActivityResponseDto } from './get-user-activity.response.dto';
export declare class GetUserActivityService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(userId: string, query: GetUserActivityRequestDto): Promise<GetUserActivityResponseDto>;
    private getActivityDescription;
}
