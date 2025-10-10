export declare enum ReactionType {
    LIKE = "like",
    DISLIKE = "dislike",
    HEART = "heart",
    LAUGH = "laugh",
    SURPRISED = "surprised",
    ANGRY = "angry",
    THUMBS_UP = "thumbs_up",
    THUMBS_DOWN = "thumbs_down",
    CELEBRATE = "celebrate",
    CONFUSED = "confused"
}
export declare class AddCommentReactionRequestDto {
    reactionType: ReactionType;
    userId: string;
    customEmoji?: string;
    reactionNote?: string;
}
