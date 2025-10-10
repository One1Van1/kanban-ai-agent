export declare class TaskLinkDataDto {
    id: string;
    sourceTaskId: string;
    targetTaskId: string;
    linkType: string;
    description?: string;
    createdBy: string;
    createdAt: Date;
    isActive: boolean;
}
export declare class CreateTaskLinkResponseDto {
    success: boolean;
    data: TaskLinkDataDto;
    message: string;
}
