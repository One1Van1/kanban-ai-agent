import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetFlowService } from './get-flow.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { GetFlowQueryDto } from './get-flow.query.dto';

describe('GetFlowService', () => {
  let service: GetFlowService;
  let flowRepository: jest.Mocked<Repository<Flow>>;

  const mockFlowRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetFlowService,
        {
          provide: getRepositoryToken(Flow),
          useValue: mockFlowRepository,
        },
      ],
    }).compile();

    service = module.get<GetFlowService>(GetFlowService);
    flowRepository = module.get(getRepositoryToken(Flow));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const queryDto: GetFlowQueryDto = {
      id: 'flow-123',
    };

    const mockFlow = {
      id: 'flow-123',
      name: 'Test Flow',
      description: 'Test flow description',
      status: FlowStatus.ACTIVE,
      definition: {
        blocks: [
          {
            id: 'block-1',
            type: 'extract_files',
            position: { x: 100, y: 100 },
            configuration: { fileTypes: ['pdf'] },
          },
        ],
        edges: [],
      },
      agentId: 'agent-123',
      metadata: { version: 1, tags: ['test'] },
      createdBy: 'user-123',
      updatedBy: 'user-456',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return flow successfully', async () => {
      flowRepository.findOne.mockResolvedValue(mockFlow as any);

      const result = await service.execute(queryDto);

      expect(flowRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'flow-123' },
        relations: ['agent'],
      });
      expect(result.flowId).toBe('flow-123');
      expect(result.name).toBe('Test Flow');
      expect(result.status).toBe(FlowStatus.ACTIVE);
    });

    it('should throw NotFoundException when flow not found', async () => {
      flowRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(queryDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(flowRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'flow-123' },
        relations: ['agent'],
      });
    });

    it('should include all flow properties in response', async () => {
      flowRepository.findOne.mockResolvedValue(mockFlow as any);

      const result = await service.execute(queryDto);

      expect(result).toMatchObject({
        flowId: mockFlow.id,
        name: mockFlow.name,
        description: mockFlow.description,
        status: mockFlow.status,
        definition: mockFlow.definition,
        agentId: mockFlow.agentId,
        metadata: mockFlow.metadata,
        createdBy: mockFlow.createdBy,
        updatedBy: mockFlow.updatedBy,
        createdAt: mockFlow.createdAt,
        updatedAt: mockFlow.updatedAt,
      });
    });
  });
});
