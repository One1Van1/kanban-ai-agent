import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { ReorderBoardColumnsRequestDto } from './reorder-board-columns.request.dto';
import { ReorderBoardColumnsResponseDto } from './reorder-board-columns.response.dto';
export declare class ReorderBoardColumnsService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(requestDto: ReorderBoardColumnsRequestDto): Promise<ReorderBoardColumnsResponseDto>;
    private validateBoardExists;
    private getCurrentBoardColumns;
    private validateReorderRequest;
    private calculatePositionChanges;
    private createReorderHistoryLog;
    private getUserDisplayName;
    private buildBoardLayout;
    private generateChangesSummary;
}
