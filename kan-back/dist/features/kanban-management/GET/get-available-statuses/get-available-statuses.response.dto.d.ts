export declare class TaskStatusDto {
    id: string;
    name: string;
    description: string;
    color: string;
    category: string;
    order: number;
    isInitial: boolean;
    isFinal: boolean;
}
export declare class StatusTransitionDto {
    from: string;
    to: string;
    name: string;
}
export declare class StatusesDataDto {
    statuses: TaskStatusDto[];
    transitions: StatusTransitionDto[];
    defaultStatus: string;
    totalStatuses: number;
}
export declare class GetAvailableStatusesResponseDto {
    success: boolean;
    data: StatusesDataDto;
    message: string;
}
