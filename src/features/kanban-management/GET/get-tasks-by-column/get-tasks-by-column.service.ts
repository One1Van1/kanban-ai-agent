import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTasksByColumnQueryDto } from './get-tasks-by-column.query.dto';
import { GetTasksByColumnResponseDto } from './get-tasks-by-column.response.dto';
import { TaskHistory } from '../../../../entities/task-history.entity';

@Injectable()
export class GetTasksByColumnService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async execute(
    column: string,
    query: GetTasksByColumnQueryDto,
  ): Promise<GetTasksByColumnResponseDto> {
    // Получаем последние записи для каждой задачи в указанной колонке
    const subQuery = this.taskHistoryRepository
      .createQueryBuilder('th_sub')
      .select('th_sub.taskId')
      .addSelect('MAX(th_sub.createdAt)', 'maxCreatedAt')
      .where('th_sub.toColumn = :column OR th_sub.fromColumn = :column', {
        column,
      })
      .groupBy('th_sub.taskId');

    const tasksQuery = this.taskHistoryRepository
      .createQueryBuilder('th')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'latest',
        'th.taskId = latest.taskId AND th.createdAt = latest.maxCreatedAt',
      )
      .where('th.toColumn = :column', { column })
      .setParameters(subQuery.getParameters())
      .orderBy('th.createdAt', 'DESC')
      .skip(query.offset || 0)
      .take(query.limit || 10);

    const [tasks, total] = await Promise.all([
      tasksQuery.getMany(),
      this.taskHistoryRepository
        .createQueryBuilder('th')
        .innerJoin(
          `(${subQuery.getQuery()})`,
          'latest',
          'th.taskId = latest.taskId AND th.createdAt = latest.maxCreatedAt',
        )
        .where('th.toColumn = :column', { column })
        .setParameters(subQuery.getParameters())
        .getCount(),
    ]);

    return new GetTasksByColumnResponseDto(tasks, total, column, query);
  }
}
