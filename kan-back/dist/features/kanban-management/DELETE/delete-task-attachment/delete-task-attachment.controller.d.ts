import { DeleteTaskAttachmentService } from './delete-task-attachment.service';
import { DeleteTaskAttachmentRequestDto } from './delete-task-attachment.request.dto';
import { DeleteTaskAttachmentResponseDto } from './delete-task-attachment.response.dto';
export declare class DeleteTaskAttachmentController {
    private readonly service;
    constructor(service: DeleteTaskAttachmentService);
    deleteAttachment(taskId: string, attachmentId: string, requestDto: DeleteTaskAttachmentRequestDto): Promise<DeleteTaskAttachmentResponseDto>;
}
