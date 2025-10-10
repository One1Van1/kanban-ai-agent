export declare enum BoardDeleteMode {
    SOFT_DELETE = "SOFT_DELETE",
    HARD_DELETE = "HARD_DELETE",
    ARCHIVE = "ARCHIVE",
    EXPORT_AND_DELETE = "EXPORT_AND_DELETE"
}
export declare class DeleteBoardRequestDto {
    deleteMode?: BoardDeleteMode;
    deletedBy: string;
    deleteReason?: string;
    forceDelete?: boolean;
    notifyMembers?: boolean;
    targetBoardId?: string;
    createBackup?: boolean;
    deleteFiles?: boolean;
}
