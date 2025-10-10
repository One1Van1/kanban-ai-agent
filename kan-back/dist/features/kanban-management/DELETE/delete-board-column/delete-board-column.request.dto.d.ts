export declare enum ColumnDeleteMode {
    SOFT_DELETE = "soft_delete",
    HARD_DELETE = "hard_delete",
    MERGE_WITH_ANOTHER = "merge_with_another"
}
export declare class DeleteBoardColumnRequestDto {
    deleteMode?: ColumnDeleteMode;
    deletedBy: string;
    deleteReason?: string;
    targetColumnId?: string;
    forceDelete?: boolean;
    notifyUsers?: boolean;
}
