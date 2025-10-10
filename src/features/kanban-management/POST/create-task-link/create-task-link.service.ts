import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { CreateTaskLinkRequestDto } from './create-task-link.request.dto';
import { CreateTaskLinkResponseDto } from './create-task-link.response.dto';

@Injectable()
export class CreateTaskLinkService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    sourceTaskId: string,
    requestDto: CreateTaskLinkRequestDto,
  ): Promise<CreateTaskLinkResponseDto> {
    const { targetTaskId, linkType, description, createdBy } = requestDto;

    // Валидация: задача не может ссылаться на саму себя
    if (sourceTaskId === targetTaskId) {
      throw new Error('Task cannot link to itself');
    }

    // Проверяем, не существует ли уже такая связь
    const existingLink = await this.checkExistingLink(
      sourceTaskId,
      targetTaskId,
      linkType,
    );
    if (existingLink) {
      throw new Error(
        `Link of type "${linkType}" already exists between these tasks`,
      );
    }

    // Создаем запись в истории задач для логирования создания связи
    const linkEntry = this.taskHistoryRepository.create({
      taskId: sourceTaskId,
      taskKey: sourceTaskId,
      taskTitle: `Link created: ${sourceTaskId} ${linkType} ${targetTaskId}`,
      action: 'link_created',
      agentId: createdBy,
      status: 'completed',
      context: {
        sourceTaskId,
        targetTaskId,
        linkType,
        description,
        linkDirection: 'outbound',
      },
    });

    const savedEntry = await this.taskHistoryRepository.save(linkEntry);

    // Создаем обратную запись для целевой задачи
    const reverseLinkType = this.getReverseLinkType(linkType);
    if (reverseLinkType) {
      const reverseLinkEntry = this.taskHistoryRepository.create({
        taskId: targetTaskId,
        taskKey: targetTaskId,
        taskTitle: `Link created: ${targetTaskId} ${reverseLinkType} ${sourceTaskId}`,
        action: 'link_created',
        agentId: createdBy,
        status: 'completed',
        context: {
          sourceTaskId: targetTaskId,
          targetTaskId: sourceTaskId,
          linkType: reverseLinkType,
          description,
          linkDirection: 'inbound',
          originalLinkId: savedEntry.id,
        },
      });

      await this.taskHistoryRepository.save(reverseLinkEntry);
    }

    // Формируем ответ
    const linkData = {
      id: savedEntry.id,
      sourceTaskId,
      targetTaskId,
      linkType,
      description,
      createdBy,
      createdAt: savedEntry.createdAt,
      isActive: true,
    };

    return {
      success: true,
      data: linkData,
      message: 'Task link created successfully',
    };
  }

  private async checkExistingLink(
    sourceTaskId: string,
    targetTaskId: string,
    linkType: string,
  ): Promise<boolean> {
    const existingLink = await this.taskHistoryRepository.findOne({
      where: {
        taskId: sourceTaskId,
        action: 'link_created',
        context: {
          targetTaskId,
          linkType,
        } as any,
      },
    });

    return !!existingLink;
  }

  private getReverseLinkType(linkType: string): string | null {
    const reverseMap: Record<string, string> = {
      blocks: 'blocked_by',
      blocked_by: 'blocks',
      depends_on: 'required_by',
      required_by: 'depends_on',
      duplicates: 'duplicates',
      clones: 'clones',
      relates_to: 'relates_to',
    };

    return reverseMap[linkType] || null;
  }
}
