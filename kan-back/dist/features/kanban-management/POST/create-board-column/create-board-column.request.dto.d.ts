export declare enum ColumnType {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    IN_REVIEW = "in_review",
    DONE = "done",
    CUSTOM = "custom"
}
export declare class CreateBoardColumnRequestDto {
    boardId: string;
    name: string;
    type: ColumnType;
    position: number;
    description?: string;
    color?: string;
    wipLimit?: number;
    createdBy: string;
}
