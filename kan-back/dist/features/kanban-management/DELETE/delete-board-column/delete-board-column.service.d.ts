import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DeleteBoardColumnRequestDto } from './delete-board-column.request.dto';
import { DeleteBoardColumnResponseDto } from './delete-board-column.response.dto';
export declare class DeleteBoardColumnService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    deleteColumn(columnId: string, requestDto: DeleteBoardColumnRequestDto): Promise<DeleteBoardColumnResponseDto>;
    private getCurrentColumnState;
    private validateDeletionRequest;
    private getColumnMetadata;
    private getTasksInColumn;
    private getActiveColumnsInBoard;
    private performColumnDeletion;
    private adjustColumnPositions;
    private notifyUsersAboutDeletion;
    private createDeletionHistoryLog;
    private getRemainingColumnsCount;
}
