import { Injectable } from '@nestjs/common';
import {
  FetchExternalContextQueryDto,
  ExternalSourceType,
} from './fetch-external-context.query.dto';
import { FetchExternalContextResponseDto } from './fetch-external-context.response.dto';

@Injectable()
export class FetchExternalContextService {
  async execute(
    taskId: string,
    query: FetchExternalContextQueryDto,
  ): Promise<FetchExternalContextResponseDto> {
    // Симулируем сбор контекста из внешних источников
    const externalContexts = await this.fetchFromExternalSources(taskId, query);

    return new FetchExternalContextResponseDto(
      true,
      taskId,
      externalContexts,
      query,
      `Собран контекст из ${externalContexts.length} внешних источников`,
    );
  }

  private async fetchFromExternalSources(
    taskId: string,
    query: FetchExternalContextQueryDto,
  ) {
    const contexts = [];
    const sources = query.sources || Object.values(ExternalSourceType);
    const maxResults = query.maxResultsPerSource || 5;

    for (const source of sources) {
      const sourceContext = await this.fetchFromSource(
        source,
        taskId,
        query,
        maxResults,
      );
      if (sourceContext) {
        contexts.push(sourceContext);
      }
    }

    return contexts;
  }

  private async fetchFromSource(
    sourceType: ExternalSourceType,
    taskId: string,
    query: FetchExternalContextQueryDto,
    maxResults: number,
  ) {
    // Симулируем задержку запроса к внешнему источнику
    await new Promise((resolve) => setTimeout(resolve, 100));

    const mockData = this.generateMockDataForSource(
      sourceType,
      taskId,
      query,
      maxResults,
    );

    return {
      sourceType,
      sourceName: this.getSourceName(sourceType),
      isAvailable: true,
      lastUpdated: new Date().toISOString(),
      items: mockData,
      totalFound: mockData.length,
      searchQuery: query.keywords?.join(' ') || `task-${taskId}`,
    };
  }

  private generateMockDataForSource(
    sourceType: ExternalSourceType,
    taskId: string,
    query: FetchExternalContextQueryDto,
    maxResults: number,
  ) {
    const items = [];
    const itemCount = Math.min(maxResults, Math.floor(Math.random() * 3) + 1);

    for (let i = 1; i <= itemCount; i++) {
      items.push({
        id: `${sourceType}-item-${i}`,
        title: this.generateTitleForSource(sourceType, i, taskId),
        content: this.generateContentForSource(sourceType, i, taskId),
        url: this.generateUrlForSource(sourceType, i),
        author: `user-${i}@example.com`,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        relevanceScore: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
        metadata: this.generateMetadataForSource(sourceType, i),
      });
    }

    return items;
  }

  private getSourceName(sourceType: ExternalSourceType): string {
    const names = {
      [ExternalSourceType.CONFLUENCE]: 'Confluence Wiki',
      [ExternalSourceType.SLACK]: 'Slack Conversations',
      [ExternalSourceType.GITHUB]: 'GitHub Repository',
      [ExternalSourceType.DOCUMENTATION]: 'Technical Documentation',
      [ExternalSourceType.KNOWLEDGE_BASE]: 'Knowledge Base',
      [ExternalSourceType.PREVIOUS_TICKETS]: 'Previous Tickets',
      [ExternalSourceType.CODE_REPOSITORY]: 'Code Repository',
      [ExternalSourceType.API_DOCUMENTATION]: 'API Documentation',
    };

    return names[sourceType] || sourceType;
  }

  private generateTitleForSource(
    sourceType: ExternalSourceType,
    index: number,
    taskId: string,
  ): string {
    const titles = {
      [ExternalSourceType.CONFLUENCE]: `Документация по задаче ${taskId} - часть ${index}`,
      [ExternalSourceType.SLACK]: `Обсуждение задачи ${taskId} в канале #development`,
      [ExternalSourceType.GITHUB]: `Pull Request #${100 + index} связанный с ${taskId}`,
      [ExternalSourceType.DOCUMENTATION]: `Техническая документация - раздел ${index}`,
      [ExternalSourceType.KNOWLEDGE_BASE]: `База знаний - статья ${index} по теме`,
      [ExternalSourceType.PREVIOUS_TICKETS]: `Похожая задача PREV-${100 + index}`,
      [ExternalSourceType.CODE_REPOSITORY]: `Код модуля ${index} для ${taskId}`,
      [ExternalSourceType.API_DOCUMENTATION]: `API эндпоинт документация v${index}`,
    };

    return titles[sourceType] || `${sourceType} item ${index}`;
  }

  private generateContentForSource(
    sourceType: ExternalSourceType,
    index: number,
    taskId: string,
  ): string {
    const contents = {
      [ExternalSourceType.CONFLUENCE]: `Подробная документация по реализации функциональности для задачи ${taskId}. Включает архитектурные решения и примеры кода.`,
      [ExternalSourceType.SLACK]: `Разработчики обсуждали подходы к решению задачи ${taskId}. Были предложены несколько вариантов реализации.`,
      [ExternalSourceType.GITHUB]: `Изменения в коде для решения аналогичной проблемы. Может служить основой для задачи ${taskId}.`,
      [ExternalSourceType.DOCUMENTATION]: `Техническая документация описывает требования и ограничения для данного типа задач.`,
      [ExternalSourceType.KNOWLEDGE_BASE]: `Статья в базе знаний содержит best practices и рекомендации по решению подобных задач.`,
      [ExternalSourceType.PREVIOUS_TICKETS]: `Ранее решенная похожая задача с подробным описанием процесса и результатов.`,
      [ExternalSourceType.CODE_REPOSITORY]: `Существующий код модуля, который может быть адаптирован для текущей задачи.`,
      [ExternalSourceType.API_DOCUMENTATION]: `Документация API эндпоинтов, которые будут использоваться в рамках задачи.`,
    };

    return (
      contents[sourceType] || `Content from ${sourceType} for item ${index}`
    );
  }

  private generateUrlForSource(
    sourceType: ExternalSourceType,
    index: number,
  ): string {
    const baseUrls = {
      [ExternalSourceType.CONFLUENCE]:
        'https://company.atlassian.net/wiki/spaces/DEV/pages',
      [ExternalSourceType.SLACK]:
        'https://company.slack.com/archives/C1234567890',
      [ExternalSourceType.GITHUB]: 'https://github.com/company/project/pull',
      [ExternalSourceType.DOCUMENTATION]: 'https://docs.company.com/technical',
      [ExternalSourceType.KNOWLEDGE_BASE]: 'https://kb.company.com/articles',
      [ExternalSourceType.PREVIOUS_TICKETS]:
        'https://company.atlassian.net/browse/PREV',
      [ExternalSourceType.CODE_REPOSITORY]:
        'https://github.com/company/project/blob/main/src',
      [ExternalSourceType.API_DOCUMENTATION]: 'https://api.company.com/docs',
    };

    return `${baseUrls[sourceType] || 'https://example.com'}/${100 + index}`;
  }

  private generateMetadataForSource(
    sourceType: ExternalSourceType,
    index: number,
  ) {
    const baseMetadata = {
      sourceType,
      indexPosition: index,
      lastAccessed: new Date().toISOString(),
    };

    switch (sourceType) {
      case ExternalSourceType.GITHUB:
        return {
          ...baseMetadata,
          branch: 'main',
          commitHash: `abc123${index}`,
          filesChanged: Math.floor(Math.random() * 10) + 1,
        };
      case ExternalSourceType.SLACK:
        return {
          ...baseMetadata,
          channel: '#development',
          messageCount: Math.floor(Math.random() * 20) + 5,
          participants: [`user${index}`, 'developer', 'manager'],
        };
      case ExternalSourceType.CONFLUENCE:
        return {
          ...baseMetadata,
          space: 'DEV',
          pageViews: Math.floor(Math.random() * 100) + 50,
          lastEditor: `editor${index}@company.com`,
        };
      default:
        return baseMetadata;
    }
  }
}
