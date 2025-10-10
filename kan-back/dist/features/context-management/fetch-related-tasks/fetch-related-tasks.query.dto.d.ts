export declare enum RelationshipType {
    BLOCKS = "blocks",
    BLOCKED_BY = "blocked_by",
    DEPENDS_ON = "depends_on",
    RELATED_TO = "related_to",
    DUPLICATE = "duplicate",
    SUBTASK = "subtask",
    PARENT = "parent"
}
export declare class FetchRelatedTasksQueryDto {
    relationshipType?: RelationshipType;
    limit?: number;
    includeSubtasks?: boolean;
    includeParents?: boolean;
}
