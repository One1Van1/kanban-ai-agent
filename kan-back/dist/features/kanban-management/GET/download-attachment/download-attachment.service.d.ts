import { Repository } from 'typeorm';
import { Response } from 'express';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DownloadAttachmentQueryDto } from './download-attachment.query.dto';
export declare class DownloadAttachmentService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(attachmentId: string, query: DownloadAttachmentQueryDto, res: Response): Promise<void>;
    private getAttachmentRecord;
    private extractAttachmentData;
    private setDownloadHeaders;
    private streamFile;
    private resolveFilePath;
    private logDownloadActivity;
}
