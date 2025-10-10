export declare class AttachFileResponseDto {
    success: boolean;
    taskKey: string;
    message: string;
    error?: string;
    constructor(success: boolean, taskKey: string, message: string, error?: string);
}
