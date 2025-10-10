import { AddCommentReactionService } from './add-comment-reaction.service';
import { AddCommentReactionRequestDto } from './add-comment-reaction.request.dto';
import { AddCommentReactionResponseDto } from './add-comment-reaction.response.dto';
export declare class AddCommentReactionController {
    private readonly service;
    constructor(service: AddCommentReactionService);
    handle(commentId: string, requestDto: AddCommentReactionRequestDto): Promise<AddCommentReactionResponseDto>;
}
