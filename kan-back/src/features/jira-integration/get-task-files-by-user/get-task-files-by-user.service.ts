import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetTaskFilesByUserQueryDto,
  FileType,
  SortBy,
  SortOrder,
} from './get-task-files-by-user.query.dto';
import {
  GetTaskFilesByUserResponseDto,
  TaskFileDto,
} from './get-task-files-by-user.response.dto';

@Injectable()
export class GetTaskFilesByUserService {
  constructor(private readonly configService: ConfigService) {}

  async execute(
    taskId: string,
    userId: string,
    query: GetTaskFilesByUserQueryDto,
  ): Promise<GetTaskFilesByUserResponseDto> {
    try {
      // Валидация входных параметров
      if (!taskId || !userId) {
        throw new BadRequestException('Task ID and User ID are required');
      }

      // Получаем конфигурацию Jira
      const jiraConfig = await this.getJiraConfiguration();

      // Получаем файлы задачи
      const taskFiles = await this.getTaskFiles(taskId, jiraConfig);

      // Фильтруем файлы по пользователю
      const userFiles = this.filterFilesByUser(taskFiles, userId);

      // Применяем фильтры и сортировку
      const filteredFiles = this.applyFilters(userFiles, query);
      const sortedFiles = this.applySorting(filteredFiles, query);

      // Применяем пагинацию
      const { paginatedFiles, totalFiles } = this.applyPagination(
        sortedFiles,
        query,
      );

      // Преобразуем в DTO
      const fileDtos = this.transformToDto(paginatedFiles);

      // Подсчитываем файлы по типам
      const fileTypeCounts = this.calculateFileTypeCounts(userFiles);

      return new GetTaskFilesByUserResponseDto(
        fileDtos,
        totalFiles,
        query.page || 1,
        query.limit || 10,
        fileTypeCounts,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve task files: ${error.message}`,
      );
    }
  }

  private async getJiraConfiguration() {
    const baseUrl = this.configService.get<string>('JIRA_BASE_URL');
    const email = this.configService.get<string>('JIRA_EMAIL');
    const token = this.configService.get<string>('JIRA_API_TOKEN');

    if (!baseUrl || !email || !token) {
      throw new BadRequestException('Jira configuration is incomplete');
    }

    return { baseUrl, email, token };
  }

  private async getTaskFiles(taskId: string, jiraConfig: any) {
    try {
      const auth = Buffer.from(
        `${jiraConfig.email}:${jiraConfig.token}`,
      ).toString('base64');

      // Получаем информацию о задаче с вложениями
      const response = await fetch(
        `${jiraConfig.baseUrl}/rest/api/3/issue/${taskId}?expand=attachment`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(`Task with ID ${taskId} not found`);
        }
        throw new BadRequestException(`Jira API error: ${response.statusText}`);
      }

      const taskData = await response.json();
      return taskData.fields?.attachment || [];
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch task attachments: ${error.message}`,
      );
    }
  }

  private filterFilesByUser(files: any[], userId: string) {
    return files.filter((file) => {
      // Фильтруем по ID автора или email
      return (
        file.author?.accountId === userId ||
        file.author?.emailAddress?.includes(userId) ||
        file.author?.displayName?.toLowerCase().includes(userId.toLowerCase())
      );
    });
  }

  private applyFilters(files: any[], query: GetTaskFilesByUserQueryDto) {
    let filteredFiles = [...files];

    // Фильтр по типу файла
    if (query.fileType) {
      filteredFiles = filteredFiles.filter((file) => {
        const fileType = this.determineFileType(file.mimeType || file.filename);
        return fileType === query.fileType;
      });
    }

    // Поиск по имени файла
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredFiles = filteredFiles.filter(
        (file) =>
          file.filename?.toLowerCase().includes(searchTerm) ||
          file.content?.toLowerCase().includes(searchTerm),
      );
    }

    return filteredFiles;
  }

  private applySorting(files: any[], query: GetTaskFilesByUserQueryDto) {
    const { sortBy = SortBy.CREATED_AT, sortOrder = SortOrder.DESC } = query;

    return files.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case SortBy.CREATED_AT:
          compareValue =
            new Date(a.created).getTime() - new Date(b.created).getTime();
          break;
        case SortBy.FILE_SIZE:
          compareValue = (a.size || 0) - (b.size || 0);
          break;
        case SortBy.FILE_NAME:
          compareValue = (a.filename || '').localeCompare(b.filename || '');
          break;
        case SortBy.FILE_TYPE:
          const typeA = this.determineFileType(a.mimeType || a.filename);
          const typeB = this.determineFileType(b.mimeType || b.filename);
          compareValue = typeA.localeCompare(typeB);
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === SortOrder.ASC ? compareValue : -compareValue;
    });
  }

  private applyPagination(files: any[], query: GetTaskFilesByUserQueryDto) {
    const { page = 1, limit = 10 } = query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      paginatedFiles: files.slice(startIndex, endIndex),
      totalFiles: files.length,
    };
  }

  private transformToDto(files: any[]): TaskFileDto[] {
    return files.map((file) => ({
      id: file.id,
      fileName: file.filename || 'Unknown',
      fileUrl: file.content || file.self,
      thumbnailUrl: file.thumbnail || undefined,
      fileType: this.determineFileType(file.mimeType || file.filename),
      mimeType: file.mimeType || 'application/octet-stream',
      fileSize: file.size || 0,
      createdAt: file.created,
      updatedAt: file.created, // Jira doesn't provide separate update time for attachments
      uploaderEmail: file.author?.emailAddress || 'Unknown',
      uploaderName: file.author?.displayName || 'Unknown User',
      description: file.content || undefined,
      tags: this.extractTags(file.filename || ''),
    }));
  }

  private determineFileType(mimeTypeOrFilename: string): FileType {
    const mimeType = mimeTypeOrFilename.toLowerCase();

    if (
      mimeType.includes('image/') ||
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(mimeType)
    ) {
      return FileType.IMAGE;
    }
    if (
      mimeType.includes('video/') ||
      /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(mimeType)
    ) {
      return FileType.VIDEO;
    }
    if (
      mimeType.includes('application/pdf') ||
      mimeType.includes('application/msword') ||
      mimeType.includes('application/vnd.openxmlformats') ||
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i.test(mimeType)
    ) {
      return FileType.DOCUMENT;
    }
    if (
      mimeType.includes('application/zip') ||
      mimeType.includes('application/x-rar') ||
      /\.(zip|rar|7z|tar|gz|bz2)$/i.test(mimeType)
    ) {
      return FileType.ARCHIVE;
    }

    return FileType.OTHER;
  }

  private extractTags(filename: string): string[] {
    const tags: string[] = [];
    const lowerFilename = filename.toLowerCase();

    // Автоматические теги на основе имени файла
    if (lowerFilename.includes('screenshot')) tags.push('screenshot');
    if (lowerFilename.includes('bug')) tags.push('bug');
    if (lowerFilename.includes('error')) tags.push('error');
    if (lowerFilename.includes('test')) tags.push('test');
    if (lowerFilename.includes('spec')) tags.push('specification');
    if (lowerFilename.includes('design')) tags.push('design');
    if (lowerFilename.includes('mockup')) tags.push('mockup');

    return tags;
  }

  private calculateFileTypeCounts(files: any[]) {
    const counts = {
      images: 0,
      documents: 0,
      archives: 0,
      videos: 0,
      others: 0,
    };

    files.forEach((file) => {
      const fileType = this.determineFileType(file.mimeType || file.filename);
      switch (fileType) {
        case FileType.IMAGE:
          counts.images++;
          break;
        case FileType.DOCUMENT:
          counts.documents++;
          break;
        case FileType.ARCHIVE:
          counts.archives++;
          break;
        case FileType.VIDEO:
          counts.videos++;
          break;
        default:
          counts.others++;
      }
    });

    return counts;
  }
}
