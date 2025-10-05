import { Injectable } from '@nestjs/common';
import { FetchTaskContextResponseDto } from './fetch-task-context.response.dto';

@Injectable()
export class FetchTaskContextService {
  async execute(taskId: string): Promise<FetchTaskContextResponseDto> {
    // Симулируем сбор контекста задачи
    const taskContext = {
      taskId,
      description: `Контекст для задачи ${taskId}`,
      comments: [
        {
          id: '1',
          author: 'AI Agent',
          content: 'Автоматический анализ задачи',
          createdAt: new Date().toISOString(),
        },
      ],
      attachments: [
        {
          id: '1',
          fileName: 'requirements.pdf',
          fileSize: 1024,
          uploadedAt: new Date().toISOString(),
        },
      ],
      worklog: [
        {
          id: '1',
          author: 'Developer',
          timeSpent: '2h',
          description: 'Анализ требований',
          loggedAt: new Date().toISOString(),
        },
      ],
      customFields: {
        priority: 'High',
        estimatedHours: 8,
        component: 'Frontend',
      },
    };

    return new FetchTaskContextResponseDto(
      true,
      taskId,
      taskContext,
      'Контекст задачи успешно получен',
    );
  }
}
