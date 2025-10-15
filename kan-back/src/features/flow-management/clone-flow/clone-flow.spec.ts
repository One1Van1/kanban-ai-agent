import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CloneFlowService } from './clone-flow.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { CloneFlowRequestDto } from './clone-flow.request.dto';

describe('CloneFlowService', () => {
  let service: CloneFlowService;
  let flowRepository: jest.Mocked<Repository<Flow>>;

  const mockFlowRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloneFlowService,
        {
          provide: getRepositoryToken(Flow),
          useValue: mockFlowRepository,
        },
      ],
    }).compile();

    service = module.get<CloneFlowService>(CloneFlowService);
    flowRepository = module.get(getRepositoryToken(Flow));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const originalFlowId = 'original-flow-123';
    const requestDto: CloneFlowRequestDto = {
      name: 'Cloned Flow',
      description: 'This is a cloned flow',
      clonedBy: 'user-456',
    };

    const originalFlow = {
      id: originalFlowId,
      name: 'Original Flow',
      description: 'Original description',
      status: FlowStatus.ACTIVE,
      definition: {
        blocks: [
          {
            id: 'block-1',
            type: 'extract_files',
            position: { x: 100, y: 100 },
          },
          { id: 'block-2', type: 'ai_request', position: { x: 200, y: 100 } },
        ],
        edges: [{ id: 'edge-1', source: 'block-1', target: 'block-2' }],
      },
      metadata: { version: 2, tags: ['original'] },
    };

    const clonedFlow = {
      id: 'cloned-flow-456',
      name: requestDto.name,
      description: requestDto.description,
      status: FlowStatus.DRAFT,
      createdBy: requestDto.clonedBy,
      createdAt: new Date(),
    };

    it('should clone flow successfully', async () => {
      flowRepository.findOne.mockResolvedValue(originalFlow as any);
      flowRepository.create.mockReturnValue(clonedFlow as any);
      flowRepository.save.mockResolvedValue(clonedFlow as any);

      const result = await service.execute(originalFlowId, requestDto);

      expect(flowRepository.findOne).toHaveBeenCalledWith({
        where: { id: originalFlowId },
      });
      expect(flowRepository.create).toHaveBeenCalled();
      expect(flowRepository.save).toHaveBeenCalled();
      expect(result.flowId).toBe(clonedFlow.id);
      expect(result.name).toBe(requestDto.name);
      expect(result.originalFlowId).toBe(originalFlowId);
      expect(result.status).toBe(FlowStatus.DRAFT);
    });

    it('should throw NotFoundException when original flow not found', async () => {
      flowRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(originalFlowId, requestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should generate new IDs for blocks and edges', async () => {
      flowRepository.findOne.mockResolvedValue(originalFlow as any);

      let createdFlowData: any;
      flowRepository.create.mockImplementation((data) => {
        createdFlowData = data;
        return { ...data, id: 'cloned-flow-456' } as any;
      });

      flowRepository.save.mockResolvedValue({
        ...clonedFlow,
        definition: createdFlowData?.definition,
      } as any);

      const result = await service.execute(originalFlowId, requestDto);

      // Check that new block IDs are generated
      const clonedBlocks = result.definition.blocks;
      expect(clonedBlocks[0].id).not.toBe('block-1');
      expect(clonedBlocks[1].id).not.toBe('block-2');
      expect(clonedBlocks[0].id).toContain('clone');
      expect(clonedBlocks[1].id).toContain('clone');

      // Check that edge IDs and references are updated
      const clonedEdges = result.definition.edges;
      expect(clonedEdges[0].id).not.toBe('edge-1');
      expect(clonedEdges[0].id).toContain('clone');
      expect(clonedEdges[0].source).toBe(clonedBlocks[0].id);
      expect(clonedEdges[0].target).toBe(clonedBlocks[1].id);
    });

    it('should preserve original metadata with originalFlowId', async () => {
      flowRepository.findOne.mockResolvedValue(originalFlow as any);

      let createdFlowData: any;
      flowRepository.create.mockImplementation((data) => {
        createdFlowData = data;
        return { ...data, id: 'cloned-flow-456' } as any;
      });

      flowRepository.save.mockResolvedValue({
        ...clonedFlow,
        metadata: createdFlowData?.metadata,
      } as any);

      await service.execute(originalFlowId, requestDto);

      expect(createdFlowData.metadata).toEqual({
        version: 1, // Reset version for clone
        tags: ['original'], // Preserve original tags
        originalFlowId: originalFlowId, // Add reference to original
      });
    });
  });
});
