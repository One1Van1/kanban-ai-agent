import { ReactionType } from './add-comment-reaction.request.dto';
export declare class AddCommentReactionResponseDto {
    commentId: string;
    reactionId: string;
    reactionType: ReactionType;
    userId: string;
    userName: string;
    customEmoji?: string;
    reactionNote?: string;
    createdAt: Date;
    totalReactions: number;
    reactionTypeCount: number;
    success: boolean;
    historyLogId: string;
    emojiDisplay: string;
}
