export declare class TaskCommentDto {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}
export declare class TaskAttachmentDto {
    id: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
}
export declare class TaskWorklogDto {
    id: string;
    author: string;
    timeSpent: string;
    description: string;
    loggedAt: string;
}
export declare class TaskCustomFieldsDto {
    priority: string;
    estimatedHours: number;
    component: string;
}
export declare class TaskContextDataDto {
    taskId: string;
    description: string;
    comments: TaskCommentDto[];
    attachments: TaskAttachmentDto[];
    worklog: TaskWorklogDto[];
    customFields: TaskCustomFieldsDto;
}
export declare class FetchTaskContextResponseDto {
    success: boolean;
    taskId: string;
    contextData: TaskContextDataDto;
    message: string;
    timestamp: string;
    constructor(success: boolean, taskId: string, contextData: TaskContextDataDto, message: string);
}
