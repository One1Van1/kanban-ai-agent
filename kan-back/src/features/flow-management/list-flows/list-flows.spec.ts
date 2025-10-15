import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ListFlowsService } from './list-flows.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { ListFlowsQueryDto } from './list-flows.query.dto';

describe('ListFlowsService', () => {
  let service: ListFlowsService;
  let flowRepository: jest.Mocked<Repository<Flow>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<Flow>>;

  const mockQueryBuilder = {
    createQueryBuilder: jest.fn(),
    orderBy: jest.fn(),
    andWhere: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    getCount: jest.fn(),
    getMany: jest.fn(),
  };

  const mockFlowRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    // Set up method chaining for query builder
    Object.values(mockQueryBuilder).forEach((method) => {
      if (
        typeof method === 'function' &&
        method !== mockQueryBuilder.getCount &&
        method !== mockQueryBuilder.getMany
      ) {
        method.mockReturnValue(mockQueryBuilder);
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListFlowsService,
        {
          provide: getRepositoryToken(Flow),
          useValue: mockFlowRepository,
        },
      ],
    }).compile();

    service = module.get<ListFlowsService>(ListFlowsService);
    flowRepository = module.get(getRepositoryToken(Flow));
    queryBuilder = mockQueryBuilder as any;

    mockFlowRepository.createQueryBuilder.mockReturnValue(queryBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const queryDto: ListFlowsQueryDto = {
      limit: 10,
      page: 1,
    };

    const mockFlows = [
      {
        id: 'flow-1',
        name: 'Test Flow 1',
        description: 'Test description 1',
        status: FlowStatus.ACTIVE,
        definition: { blocks: [{ id: 'b1' }, { id: 'b2' }], edges: [] },
        agentId: 'agent-1',
        metadata: { version: 1, tags: ['test'] },
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'flow-2',
        name: 'Test Flow 2',
        description: 'Test description 2',
        status: FlowStatus.DRAFT,
        definition: { blocks: [{ id: 'b1' }], edges: [] },
        agentId: null,
        metadata: { version: 1 },
        createdBy: 'user-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return paginated flows successfully', async () => {
      queryBuilder.getCount.mockResolvedValue(25);
      queryBuilder.getMany.mockResolvedValue(mockFlows as any);

      const result = await service.execute(queryDto);

      expect(mockFlowRepository.createQueryBuilder).toHaveBeenCalledWith(
        'flow',
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'flow.updatedAt',
        'DESC',
      );
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    it('should apply status filter', async () => {
      const queryWithStatus = { ...queryDto, status: FlowStatus.ACTIVE };
      queryBuilder.getCount.mockResolvedValue(10);
      queryBuilder.getMany.mockResolvedValue([mockFlows[0]] as any);

      await service.execute(queryWithStatus);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'flow.status = :status',
        { status: FlowStatus.ACTIVE },
      );
    });

    it('should apply search filter', async () => {
      const queryWithSearch = { ...queryDto, search: 'test content' };
      queryBuilder.getCount.mockResolvedValue(5);
      queryBuilder.getMany.mockResolvedValue(mockFlows as any);

      await service.execute(queryWithSearch);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(flow.name ILIKE :search OR flow.description ILIKE :search)',
        { search: '%test content%' },
      );
    });

    it('should apply template filter', async () => {
      const queryWithTemplate = { ...queryDto, isTemplate: true };
      queryBuilder.getCount.mockResolvedValue(3);
      queryBuilder.getMany.mockResolvedValue([mockFlows[0]] as any);

      await service.execute(queryWithTemplate);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        "flow.metadata ->> 'isTemplate' = :isTemplate",
        { isTemplate: 'true' },
      );
    });

    it('should calculate pagination correctly for page 2', async () => {
      const queryPage2 = { ...queryDto, page: 2, limit: 5 };
      queryBuilder.getCount.mockResolvedValue(12);
      queryBuilder.getMany.mockResolvedValue([mockFlows[1]] as any);

      const result = await service.execute(queryPage2);

      expect(queryBuilder.skip).toHaveBeenCalledWith(5);
      expect(queryBuilder.take).toHaveBeenCalledWith(5);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
    });

    it('should include block count in response items', async () => {
      queryBuilder.getCount.mockResolvedValue(2);
      queryBuilder.getMany.mockResolvedValue(mockFlows as any);

      const result = await service.execute(queryDto);

      expect(result.items[0].blockCount).toBe(2);
      expect(result.items[1].blockCount).toBe(1);
    });
  });
});
