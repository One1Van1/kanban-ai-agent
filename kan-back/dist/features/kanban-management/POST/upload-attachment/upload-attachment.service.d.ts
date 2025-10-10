import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { UploadAttachmentRequestDto } from './upload-attachment.request.dto';
import { UploadAttachmentResponseDto } from './upload-attachment.response.dto';
export declare class UploadAttachmentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, requestDto: UploadAttachmentRequestDto): Promise<UploadAttachmentResponseDto>;
    private validateFile;
    private isValidBase64;
    private generateFileUrl;
    private generateFileId;
    private formatFileSize;
}
