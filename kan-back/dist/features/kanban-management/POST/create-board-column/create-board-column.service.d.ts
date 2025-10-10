import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { CreateBoardColumnRequestDto, ColumnType } from './create-board-column.request.dto';
import { CreateBoardColumnResponseDto } from './create-board-column.response.dto';
export declare class CreateBoardColumnService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    createColumn(requestDto: CreateBoardColumnRequestDto): Promise<CreateBoardColumnResponseDto>;
    private validateBoardAndPosition;
    private getExistingColumns;
    private getAdjacentColumns;
    private getTotalColumnsInBoard;
    getAvailableColumnTypes(): Promise<ColumnType[]>;
    validateColumnName(boardId: string, name: string): Promise<boolean>;
}
