import { Response } from 'express';
import { DownloadAttachmentService } from './download-attachment.service';
import { DownloadAttachmentQueryDto } from './download-attachment.query.dto';
export declare class DownloadAttachmentController {
    private readonly service;
    constructor(service: DownloadAttachmentService);
    handle(attachmentId: string, query: DownloadAttachmentQueryDto, res: Response): Promise<void>;
}
