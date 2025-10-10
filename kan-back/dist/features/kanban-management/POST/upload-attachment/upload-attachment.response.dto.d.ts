export declare class AttachmentDataDto {
    id: string;
    taskId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    fileSizeFormatted: string;
    fileUrl: string;
    downloadUrl: string;
    uploadedBy: string;
    description?: string;
    uploadedAt: Date;
    isActive: boolean;
}
export declare class UploadAttachmentResponseDto {
    success: boolean;
    data: AttachmentDataDto;
    message: string;
}
