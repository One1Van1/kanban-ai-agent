import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetBoardSummaryRequestDto } from './get-board-summary.request.dto';
import { GetBoardSummaryResponseDto } from './get-board-summary.response.dto';
export declare class GetBoardSummaryService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(query: GetBoardSummaryRequestDto): Promise<GetBoardSummaryResponseDto>;
    private getColumnStatistics;
    private getPriorityStatistics;
    private getDetailedStatistics;
}
