export declare enum TaskLinkType {
    BLOCKS = "blocks",
    BLOCKED_BY = "blocked_by",
    RELATES_TO = "relates_to",
    DUPLICATES = "duplicates",
    CLONES = "clones",
    DEPENDS_ON = "depends_on",
    REQUIRED_BY = "required_by"
}
export declare class CreateTaskLinkRequestDto {
    targetTaskId: string;
    linkType: TaskLinkType;
    description?: string;
    createdBy: string;
}
