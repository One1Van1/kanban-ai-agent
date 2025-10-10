import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { UpdateBoardColumnRequestDto } from './update-board-column.request.dto';
import { UpdateBoardColumnResponseDto } from './update-board-column.response.dto';
export declare class UpdateBoardColumnService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    updateColumn(columnId: string, requestDto: UpdateBoardColumnRequestDto): Promise<UpdateBoardColumnResponseDto>;
    private getCurrentColumnState;
    private validateUpdateRequest;
    private calculateUpdateMetadata;
    private applyUpdates;
    private handlePositionUpdate;
    private getTotalColumnsInBoard;
    private findColumnByNameInBoard;
    private getAffectedColumnsByPositionChange;
    private getCurrentTaskCountInColumn;
    private getColumnVersion;
    private isValidHexColor;
}
