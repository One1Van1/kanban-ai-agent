import { DeleteCommentService } from './delete-comment.service';
import { DeleteCommentRequestDto } from './delete-comment.request.dto';
import { DeleteCommentResponseDto } from './delete-comment.response.dto';
export declare class DeleteCommentController {
    private readonly service;
    constructor(service: DeleteCommentService);
    handle(commentId: string, requestDto: DeleteCommentRequestDto): Promise<DeleteCommentResponseDto>;
}
