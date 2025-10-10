export declare class DeleteTaskLinkResponseDto {
    taskId: string;
    linkId: string;
    linkedTaskId: string;
    linkType: string;
    linkDirection: string;
    deletedBy?: string;
    deletedAt: Date;
    deleteReason?: string;
    linkedTaskTitle: string;
    remainingLinksCount: number;
    success: boolean;
    historyLogId: string;
}
