import { UploadAttachmentService } from './upload-attachment.service';
import { UploadAttachmentRequestDto } from './upload-attachment.request.dto';
import { UploadAttachmentResponseDto } from './upload-attachment.response.dto';
export declare class UploadAttachmentController {
    private readonly service;
    constructor(service: UploadAttachmentService);
    handle(taskId: string, requestDto: UploadAttachmentRequestDto): Promise<UploadAttachmentResponseDto>;
}
