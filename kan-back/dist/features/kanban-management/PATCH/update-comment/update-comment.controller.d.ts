import { UpdateCommentService } from './update-comment.service';
import { UpdateCommentRequestDto } from './update-comment.request.dto';
import { UpdateCommentResponseDto } from './update-comment.response.dto';
export declare class UpdateCommentController {
    private readonly service;
    constructor(service: UpdateCommentService);
    handle(commentId: string, requestDto: UpdateCommentRequestDto): Promise<UpdateCommentResponseDto>;
}
