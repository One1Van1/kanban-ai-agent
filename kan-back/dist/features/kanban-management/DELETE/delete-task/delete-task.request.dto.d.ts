export declare enum DeleteMode {
    SOFT_DELETE = "soft_delete",
    HARD_DELETE = "hard_delete",
    ARCHIVE = "archive"
}
export declare class DeleteTaskRequestDto {
    deleteMode?: DeleteMode;
    deletedBy: string;
    deleteReason?: string;
    forceDelete?: boolean;
    deleteRelatedData?: boolean;
    notifyUsers?: boolean;
}
