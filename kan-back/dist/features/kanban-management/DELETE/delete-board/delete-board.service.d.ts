import { Repository } from 'typeorm';
import { DeleteBoardRequestDto } from './delete-board.request.dto';
import { DeleteBoardResponseDto } from './delete-board.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class DeleteBoardService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    deleteBoard(boardId: string, requestDto: DeleteBoardRequestDto): Promise<DeleteBoardResponseDto>;
    private getCurrentBoardState;
    private validateDeletionRequest;
    private getBoardMetadata;
    private getTasksInBoard;
    private getColumnsInBoard;
    private getBoardMembers;
    private getBoardFilesCount;
    private getActiveBoardsCount;
    private performBoardDeletion;
    private getDefaultColumnInBoard;
    private createBoardBackup;
    private deleteAssociatedFiles;
    private notifyMembersAboutDeletion;
    private createDeletionHistoryLog;
}
