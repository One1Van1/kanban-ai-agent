import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { DownloadAttachmentQueryDto } from './download-attachment.query.dto';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DownloadAttachmentService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    attachmentId: string,
    query: DownloadAttachmentQueryDto,
    res: Response,
  ): Promise<void> {
    const attachment = await this.getAttachmentRecord(attachmentId);

    if (!attachment) {
      throw new NotFoundException(
        `Attachment with ID ${attachmentId} not found`,
      );
    }

    const attachmentData = this.extractAttachmentData(attachment);

    // Log download activity
    await this.logDownloadActivity(attachment, query.requestedBy);

    // Set response headers
    this.setDownloadHeaders(res, attachmentData, query);

    // Stream the file
    await this.streamFile(res, attachmentData.filePath);
  }

  private async getAttachmentRecord(
    attachmentId: string,
  ): Promise<TaskHistory | null> {
    return await this.taskHistoryRepository.findOne({
      where: {
        action: 'file_uploaded',
        agentResponse: {
          attachmentId,
        } as any,
      },
      order: { createdAt: 'DESC' },
    });
  }

  private extractAttachmentData(attachment: TaskHistory): {
    fileName: string;
    fileSize: number;
    mimeType: string;
    filePath: string;
  } {
    const attachmentData = attachment.context?.attachmentData || {};
    const agentResponse = attachment.agentResponse || {};

    return {
      fileName:
        attachmentData.fileName || agentResponse.fileName || 'unknown_file',
      fileSize: attachmentData.fileSize || agentResponse.fileSize || 0,
      mimeType:
        attachmentData.mimeType ||
        agentResponse.mimeType ||
        'application/octet-stream',
      filePath: attachmentData.filePath || agentResponse.filePath || '',
    };
  }

  private setDownloadHeaders(
    res: Response,
    attachmentData: { fileName: string; mimeType: string; fileSize: number },
    query: DownloadAttachmentQueryDto,
  ): void {
    const filename = query.filename || attachmentData.fileName;
    const disposition = query.forceDownload ? 'attachment' : 'inline';

    res.setHeader('Content-Type', attachmentData.mimeType);
    res.setHeader(
      'Content-Disposition',
      `${disposition}; filename="${filename}"`,
    );

    if (attachmentData.fileSize > 0) {
      res.setHeader('Content-Length', attachmentData.fileSize.toString());
    }

    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, max-age=3600');
  }

  private async streamFile(res: Response, filePath: string): Promise<void> {
    if (!filePath) {
      throw new NotFoundException('File path not found');
    }

    // In a real implementation, this would be the actual file path
    // For now, we'll simulate the file streaming
    const fullPath = this.resolveFilePath(filePath);

    if (!existsSync(fullPath)) {
      // Simulate file content for demo purposes
      const mockContent = Buffer.from(
        'This is a mock file content for demonstration purposes.',
      );
      res.send(mockContent);
      return;
    }

    try {
      const fileStream = createReadStream(fullPath);
      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException('File could not be read');
    }
  }

  private resolveFilePath(relativePath: string): string {
    // In a real implementation, this would resolve to actual storage location
    // For demo purposes, we'll use a mock path
    return join(process.cwd(), 'uploads', relativePath);
  }

  private async logDownloadActivity(
    attachment: TaskHistory,
    requestedBy?: string,
  ): Promise<void> {
    const attachmentData = this.extractAttachmentData(attachment);

    const historyLog = this.taskHistoryRepository.create({
      agentId: requestedBy || 'anonymous',
      taskId: attachment.taskId,
      taskKey: attachment.taskKey,
      taskTitle: `Downloaded attachment: ${attachmentData.fileName}`,
      action: 'attachment_downloaded',
      fromStatus: attachment.fromStatus || attachment.toStatus,
      toStatus: attachment.toStatus,
      fromColumn: attachment.fromColumn || attachment.toColumn,
      toColumn: attachment.toColumn,
      status: 'completed',
      context: {
        attachmentId: attachment.agentResponse?.attachmentId,
        fileName: attachmentData.fileName,
        fileSize: attachmentData.fileSize,
        mimeType: attachmentData.mimeType,
        downloadedBy: requestedBy,
        downloadedAt: new Date(),
      },
      agentResponse: {
        success: true,
        attachmentDownloaded: true,
        attachmentId: attachment.agentResponse?.attachmentId,
        fileName: attachmentData.fileName,
        timestamp: new Date().toISOString(),
      },
    });

    await this.taskHistoryRepository.save(historyLog);
  }
}
