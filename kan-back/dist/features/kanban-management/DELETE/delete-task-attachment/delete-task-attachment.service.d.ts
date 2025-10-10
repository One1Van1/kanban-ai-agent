import { Repository } from 'typeorm';
import { DeleteTaskAttachmentRequestDto } from './delete-task-attachment.request.dto';
import { DeleteTaskAttachmentResponseDto } from './delete-task-attachment.response.dto';
import { TaskHistory } from '@/entities/task-history.entity';
export declare class DeleteTaskAttachmentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    deleteAttachment(taskId: string, attachmentId: string, requestDto: DeleteTaskAttachmentRequestDto): Promise<DeleteTaskAttachmentResponseDto>;
    private validateTaskExists;
    private getAttachmentRecord;
    private validateDeletionPermissions;
    private getAttachmentMetadata;
    private performAttachmentDeletion;
    private createAttachmentBackup;
    private moveFileToTrash;
    private deletePhysicalFile;
    private notifyTaskWatchers;
    private getRemainingAttachmentsCount;
    private createDeletionHistoryLog;
}
