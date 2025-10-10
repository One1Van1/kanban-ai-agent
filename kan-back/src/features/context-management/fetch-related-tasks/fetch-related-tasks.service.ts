import { Injectable } from '@nestjs/common';
import {
  FetchRelatedTasksQueryDto,
  RelationshipType,
} from './fetch-related-tasks.query.dto';
import { FetchRelatedTasksResponseDto } from './fetch-related-tasks.response.dto';

@Injectable()
export class FetchRelatedTasksService {
  async execute(
    taskId: string,
    query: FetchRelatedTasksQueryDto,
  ): Promise<FetchRelatedTasksResponseDto> {
    // Симулируем поиск связанных задач
    const relatedTasks = this.generateMockRelatedTasks(taskId, query);

    return new FetchRelatedTasksResponseDto(
      true,
      taskId,
      relatedTasks,
      query,
      `Найдено ${relatedTasks.length} связанных задач`,
    );
  }

  private generateMockRelatedTasks(
    taskId: string,
    query: FetchRelatedTasksQueryDto,
  ) {
    const tasks = [];
    const limit = query.limit || 10;

    // Генерируем мок данные для связанных задач
    for (let i = 1; i <= Math.min(limit, 5); i++) {
      tasks.push({
        id: `related-task-${i}`,
        key: `TASK-${1000 + i}`,
        title: `Связанная задача ${i} для ${taskId}`,
        status: i % 2 === 0 ? 'In Progress' : 'To Do',
        priority: i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low',
        assignee: `user-${i}@example.com`,
        relationshipType: this.getRelationshipType(i, query.relationshipType),
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      });
    }

    // Добавляем подзадачи если включены
    if (query.includeSubtasks) {
      tasks.push({
        id: `subtask-1`,
        key: 'SUBTASK-001',
        title: `Подзадача для ${taskId}`,
        status: 'To Do',
        priority: 'Medium',
        assignee: 'developer@example.com',
        relationshipType: RelationshipType.SUBTASK,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Добавляем родительские задачи если включены
    if (query.includeParents) {
      tasks.push({
        id: `parent-task-1`,
        key: 'PARENT-001',
        title: `Родительская задача для ${taskId}`,
        status: 'In Progress',
        priority: 'High',
        assignee: 'manager@example.com',
        relationshipType: RelationshipType.PARENT,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return tasks.slice(0, limit);
  }

  private getRelationshipType(
    index: number,
    filterType?: RelationshipType,
  ): RelationshipType {
    if (filterType) {
      return filterType;
    }

    const types = [
      RelationshipType.RELATED_TO,
      RelationshipType.BLOCKS,
      RelationshipType.BLOCKED_BY,
      RelationshipType.DEPENDS_ON,
    ];

    return types[index % types.length];
  }
}
