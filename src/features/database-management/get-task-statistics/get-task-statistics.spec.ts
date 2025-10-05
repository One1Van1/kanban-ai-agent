import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GetTaskStatisticsService } from './get-task-statistics.service';
import { TaskHistory } from '../../../entities/task-history.entity';
import { GetTaskStatisticsQueryDto } from './get-task-statistics.request.dto';

describe('GetTaskStatisticsService', () => {
  let service: GetTaskStatisticsService;
  let repository: jest.Mocked<Repository<TaskHistory>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<TaskHistory>>;

  beforeEach(async () => {
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      clone: jest.fn().mockReturnThis(),
      getCount: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskStatisticsService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<GetTaskStatisticsService>(GetTaskStatisticsService);
    repository = module.get(getRepositoryToken(TaskHistory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should retrieve global statistics when no agentId provided', async () => {
      const query: GetTaskStatisticsQueryDto = {};

      queryBuilder.getCount
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // completed
        .mockResolvedValueOnce(5) // failed
        .mockResolvedValueOnce(10); // pending

      const result = await service.execute(query);

      expect(result.total).toBe(100);
      expect(result.completed).toBe(80);
      expect(result.failed).toBe(5);
      expect(result.pending).toBe(10);
      expect(result.processing).toBe(5); // 100 - 80 - 5 - 10
      expect(result.agentId).toBeUndefined();
      expect(result.success).toBe(true);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('history');
      expect(queryBuilder.where).not.toHaveBeenCalled();
    });

    it('should retrieve agent-specific statistics when agentId provided', async () => {
      const query: GetTaskStatisticsQueryDto = { agentId: 'agent-uuid' };

      queryBuilder.getCount
        .mockResolvedValueOnce(25) // total
        .mockResolvedValueOnce(20) // completed
        .mockResolvedValueOnce(2) // failed
        .mockResolvedValueOnce(3); // pending

      const result = await service.execute(query);

      expect(result.total).toBe(25);
      expect(result.completed).toBe(20);
      expect(result.failed).toBe(2);
      expect(result.pending).toBe(3);
      expect(result.processing).toBe(0); // 25 - 20 - 2 - 3
      expect(result.agentId).toBe('agent-uuid');
      expect(result.success).toBe(true);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'history.agentId = :agentId',
        { agentId: 'agent-uuid' },
      );
    });
  });
});
