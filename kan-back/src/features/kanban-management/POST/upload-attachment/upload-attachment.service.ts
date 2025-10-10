import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { UploadAttachmentRequestDto } from './upload-attachment.request.dto';
import { UploadAttachmentResponseDto } from './upload-attachment.response.dto';

@Injectable()
export class UploadAttachmentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    taskId: string,
    requestDto: UploadAttachmentRequestDto,
  ): Promise<UploadAttachmentResponseDto> {
    const {
      fileName,
      mimeType,
      fileSize,
      fileContent,
      uploadedBy,
      description,
    } = requestDto;

    // Валидация файла
    this.validateFile(fileName, mimeType, fileSize, fileContent);

    // В реальном приложении здесь был бы код для сохранения файла в S3/MinIO/etc
    const fileUrl = this.generateFileUrl(taskId, fileName);
    const fileId = this.generateFileId();

    // Создаем запись в истории задач для логирования загрузки файла
    const attachmentEntry = this.taskHistoryRepository.create({
      taskId,
      taskKey: taskId,
      taskTitle: `File attached: ${fileName}`,
      action: 'file_attached',
      agentId: uploadedBy,
      status: 'completed',
      context: {
        fileName,
        mimeType,
        fileSize,
        fileId,
        fileUrl,
        description,
        uploadedBy,
      },
    });

    const savedEntry = await this.taskHistoryRepository.save(attachmentEntry);

    // Формируем ответ
    const attachmentData = {
      id: fileId,
      taskId,
      fileName,
      mimeType,
      fileSize,
      fileSizeFormatted: this.formatFileSize(fileSize),
      fileUrl,
      downloadUrl: `${fileUrl}/download`,
      uploadedBy,
      description,
      uploadedAt: savedEntry.createdAt,
      isActive: true,
    };

    return {
      success: true,
      data: attachmentData,
      message: 'File uploaded and attached to task successfully',
    };
  }

  private validateFile(
    fileName: string,
    mimeType: string,
    fileSize: number,
    fileContent: string,
  ): void {
    // Проверка расширения файла
    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.txt',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
    ];
    const fileExtension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`File type ${fileExtension} is not allowed`);
    }

    // Проверка MIME типа
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error(`MIME type ${mimeType} is not allowed`);
    }

    // Проверка base64 контента
    if (!this.isValidBase64(fileContent)) {
      throw new Error('Invalid file content format');
    }
  }

  private isValidBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  private generateFileUrl(taskId: string, fileName: string): string {
    const timestamp = Date.now();
    return `/files/tasks/${taskId}/${timestamp}_${fileName}`;
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
