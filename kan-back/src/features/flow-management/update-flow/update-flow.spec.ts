import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateFlowService } from './update-flow.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { Agent } from '../../../entities/agent.entity';
import { UpdateFlowRequestDto } from './update-flow.request.dto';

describe('UpdateFlowService', () => {
  let service: UpdateFlowService;
  let flowRepository: jest.Mocked<Repository<Flow>>;
  let agentRepository: jest.Mocked<Repository<Agent>>;

  const mockFlowRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockAgentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFlowService,
        {
          provide: getRepositoryToken(Flow),
          useValue: mockFlowRepository,
        },
        {
          provide: getRepositoryToken(Agent),
          useValue: mockAgentRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateFlowService>(UpdateFlowService);
    flowRepository = module.get(getRepositoryToken(Flow));
    agentRepository = module.get(getRepositoryToken(Agent));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const flowId = 'flow-123';

    const existingFlow = {
      id: flowId,
      name: 'Original Flow',
      description: 'Original description',
      status: FlowStatus.DRAFT,
      definition: {
        blocks: [
          { id: 'b1', type: 'extract_files', position: { x: 100, y: 100 } },
        ],
        edges: [],
      },
      metadata: { version: 1, tags: ['original'] },
      createdBy: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateRequestDto: UpdateFlowRequestDto = {
      name: 'Updated Flow',
      description: 'Updated description',
      status: FlowStatus.ACTIVE,
      updatedBy: 'user-2',
    };

    it('should update flow successfully', async () => {
      const updatedFlow = { ...existingFlow, ...updateRequestDto };

      flowRepository.findOne.mockResolvedValue(existingFlow as any);
      flowRepository.save.mockResolvedValue(updatedFlow as any);

      const result = await service.execute(flowId, updateRequestDto);

      expect(flowRepository.findOne).toHaveBeenCalledWith({
        where: { id: flowId },
      });
      expect(flowRepository.save).toHaveBeenCalled();
      expect(result.flowId).toBe(flowId);
      expect(result.name).toBe('Updated Flow');
      expect(result.status).toBe(FlowStatus.ACTIVE);
      expect(result.updatedBy).toBe('user-2');
    });

    it('should throw NotFoundException when flow not found', async () => {
      flowRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(flowId, updateRequestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate agent exists when agentId provided', async () => {
      const requestWithAgent = { ...updateRequestDto, agentId: 'agent-123' };
      const mockAgent = { id: 'agent-123', name: 'Test Agent' };

      flowRepository.findOne.mockResolvedValue(existingFlow as any);
      agentRepository.findOne.mockResolvedValue(mockAgent as any);
      flowRepository.save.mockResolvedValue({
        ...existingFlow,
        ...requestWithAgent,
      } as any);

      const result = await service.execute(flowId, requestWithAgent);

      expect(agentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'agent-123' },
      });
      expect(result.agentId).toBe('agent-123');
    });

    it('should throw NotFoundException when agent not found', async () => {
      const requestWithAgent = {
        ...updateRequestDto,
        agentId: 'non-existent-agent',
      };

      flowRepository.findOne.mockResolvedValue(existingFlow as any);
      agentRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(flowId, requestWithAgent)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should increment version when definition is updated', async () => {
      const newDefinition = {
        blocks: [
          { id: 'b1', type: 'extract_files', position: { x: 100, y: 100 } },
          { id: 'b2', type: 'ai_request', position: { x: 200, y: 100 } },
        ],
        edges: [{ id: 'e1', source: 'b1', target: 'b2' }],
      };

      const requestWithDefinition = {
        ...updateRequestDto,
        definition: newDefinition,
        metadata: { tags: ['updated'] },
      };

      flowRepository.findOne.mockResolvedValue(existingFlow as any);
      flowRepository.save.mockResolvedValue({
        ...existingFlow,
        ...requestWithDefinition,
        metadata: { version: 2, tags: ['updated'] },
      } as any);

      const result = await service.execute(flowId, requestWithDefinition);

      expect(result.metadata?.version).toBe(2);
      expect(result.metadata?.tags).toEqual(['updated']);
    });

    it('should validate flow definition structure', async () => {
      const invalidDefinition = {
        blocks: [
          { id: 'b1', type: 'extract_files', position: { x: 100, y: 100 } },
        ], // missing required fields
        edges: [],
      } as any;

      const requestWithInvalidDefinition = {
        ...updateRequestDto,
        definition: invalidDefinition,
      };

      flowRepository.findOne.mockResolvedValue(existingFlow as any);

      await expect(
        service.execute(flowId, requestWithInvalidDefinition),
      ).rejects.toThrow(BadRequestException);
    });

    it('should only update provided fields', async () => {
      const partialUpdate = { name: 'New Name Only', updatedBy: 'user-2' };

      flowRepository.findOne.mockResolvedValue(existingFlow as any);
      flowRepository.save.mockResolvedValue({
        ...existingFlow,
        name: 'New Name Only',
        updatedBy: 'user-2',
      } as any);

      const result = await service.execute(flowId, partialUpdate);

      expect(result.name).toBe('New Name Only');
      expect(result.description).toBe(existingFlow.description); // unchanged
      expect(result.status).toBe(existingFlow.status); // unchanged
    });
  });
});
