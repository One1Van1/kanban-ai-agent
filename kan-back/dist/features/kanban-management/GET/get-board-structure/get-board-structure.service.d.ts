import { Repository } from 'typeorm';
import { GetBoardStructureRequestDto } from './get-board-structure.request.dto';
import { GetBoardStructureResponseDto } from './get-board-structure.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';
export declare class GetBoardStructureService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    private readonly defaultColumns;
    private readonly defaultWorkflow;
    private getTaskCountByColumn;
    private getSampleTasks;
    execute(queryDto: GetBoardStructureRequestDto): Promise<GetBoardStructureResponseDto>;
}
