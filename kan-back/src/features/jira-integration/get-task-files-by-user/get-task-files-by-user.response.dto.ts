import { ApiProperty } from '@nestjs/swagger';
import { FileType } from './get-task-files-by-user.query.dto';

export class TaskFileDto {
  @ApiProperty({
    example: 'file_123456',
    description: 'Unique file identifier',
  })
  id: string;

  @ApiProperty({
    example: 'screenshot_bug_report.png',
    description: 'Original file name',
  })
  fileName: string;

  @ApiProperty({
    example: 'https://example.com/files/screenshot_bug_report.png',
    description: 'Direct file download URL',
  })
  fileUrl: string;

  @ApiProperty({
    example: 'https://example.com/thumbnails/screenshot_bug_report_thumb.png',
    description: 'Thumbnail URL (for images and videos)',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    enum: FileType,
    enumName: 'FileType',
    example: FileType.IMAGE,
    description: 'Type of the file',
  })
  fileType: FileType;

  @ApiProperty({
    example: 'image/png',
    description: 'MIME type of the file',
  })
  mimeType: string;

  @ApiProperty({
    example: 524288,
    description: 'File size in bytes',
  })
  fileSize: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'File creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'File last modification timestamp',
  })
  updatedAt: string;

  @ApiProperty({
    example: 'john.doe@company.com',
    description: 'Email of user who uploaded the file',
  })
  uploaderEmail: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of user who uploaded the file',
  })
  uploaderName: string;

  @ApiProperty({
    example: 'Bug report screenshot showing login error',
    description: 'File description or comment',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: ['bug', 'screenshot', 'ui'],
    description: 'File tags for categorization',
    type: [String],
    required: false,
  })
  tags?: string[];
}

export class GetTaskFilesByUserResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task files retrieved successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    type: [TaskFileDto],
    description: 'Array of task files',
  })
  files: TaskFileDto[];

  @ApiProperty({
    example: 25,
    description: 'Total number of files matching the criteria',
  })
  totalFiles: number;

  @ApiProperty({
    example: 3,
    description: 'Total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  currentPage: number;

  @ApiProperty({
    example: 10,
    description: 'Number of files per page',
  })
  limit: number;

  @ApiProperty({
    example: {
      images: 15,
      documents: 8,
      archives: 2,
      videos: 0,
      others: 0,
    },
    description: 'Count of files by type',
  })
  fileTypeCounts: {
    images: number;
    documents: number;
    archives: number;
    videos: number;
    others: number;
  };

  constructor(
    files: TaskFileDto[],
    totalFiles: number,
    currentPage: number,
    limit: number,
    fileTypeCounts: any,
  ) {
    this.success = true;
    this.message = 'Task files retrieved successfully';
    this.files = files;
    this.totalFiles = totalFiles;
    this.totalPages = Math.ceil(totalFiles / limit);
    this.currentPage = currentPage;
    this.limit = limit;
    this.fileTypeCounts = fileTypeCounts;
  }
}
