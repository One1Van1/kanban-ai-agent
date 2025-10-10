export declare enum AttachmentDeleteMode {
    SOFT_DELETE = "SOFT_DELETE",
    HARD_DELETE = "HARD_DELETE",
    MOVE_TO_TRASH = "MOVE_TO_TRASH"
}
export declare class DeleteTaskAttachmentRequestDto {
    deleteMode?: AttachmentDeleteMode;
    deletedBy: string;
    deleteReason?: string;
    deletePhysicalFile?: boolean;
    createBackup?: boolean;
    notifyWatchers?: boolean;
}
