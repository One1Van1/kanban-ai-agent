import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateFlowService } from './create-flow.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { Agent } from '../../../entities/agent.entity';
import { CreateFlowRequestDto } from './create-flow.request.dto';

describe('CreateFlowService', () => {
  let service: CreateFlowService;
  let flowRepository: jest.Mocked<Repository<Flow>>;
  let agentRepository: jest.Mocked<Repository<Agent>>;

  const mockFlowRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAgentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFlowService,
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

    service = module.get<CreateFlowService>(CreateFlowService);
    flowRepository = module.get(getRepositoryToken(Flow));
    agentRepository = module.get(getRepositoryToken(Agent));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRequestDto: CreateFlowRequestDto = {
      name: 'Test Flow',
      description: 'Test flow description',
      definition: {
        blocks: [
          {
            id: 'block-1',
            type: 'extract_files',
            position: { x: 100, y: 100 },
            configuration: { fileTypes: ['pdf'] },
          },
          {
            id: 'block-2',
            type: 'ai_request',
            position: { x: 200, y: 100 },
            configuration: { prompt: 'Analyze content' },
          },
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'block-1',
            target: 'block-2',
          },
        ],
      },
      createdBy: 'user-123',
      metadata: {
        tags: ['test'],
        version: 1,
        isTemplate: false,
      },
    };

    it('should create flow successfully', async () => {
      const mockFlow = {
        id: 'flow-123',
        name: validRequestDto.name,
        description: validRequestDto.description,
        definition: validRequestDto.definition,
        status: FlowStatus.DRAFT,
        createdBy: validRequestDto.createdBy,
        metadata: { version: 1, tags: ['test'], isTemplate: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      flowRepository.create.mockReturnValue(mockFlow as any);
      flowRepository.save.mockResolvedValue(mockFlow as any);

      const result = await service.execute(validRequestDto);

      expect(flowRepository.create).toHaveBeenCalledWith({
        name: validRequestDto.name,
        description: validRequestDto.description,
        definition: validRequestDto.definition,
        agentId: undefined,
        status: FlowStatus.DRAFT,
        createdBy: validRequestDto.createdBy,
        metadata: { version: 1, tags: ['test'], isTemplate: false },
      });
      expect(flowRepository.save).toHaveBeenCalledWith(mockFlow);
      expect(result.flowId).toBe('flow-123');
      expect(result.name).toBe(validRequestDto.name);
    });

    it('should throw BadRequestException for empty blocks array', async () => {
      const invalidDto = {
        ...validRequestDto,
        definition: {
          blocks: [],
          edges: [],
        },
      };

      await expect(service.execute(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid edge references', async () => {
      const invalidDto = {
        ...validRequestDto,
        definition: {
          blocks: [
            {
              id: 'block-1',
              type: 'extract_files',
              position: { x: 100, y: 100 },
            },
          ],
          edges: [
            {
              id: 'edge-1',
              source: 'non-existent-block',
              target: 'block-1',
            },
          ],
        },
      };

      await expect(service.execute(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when agent not found', async () => {
      const dtoWithAgent = {
        ...validRequestDto,
        agentId: 'non-existent-agent',
      };

      agentRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(dtoWithAgent)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate agent exists when agentId provided', async () => {
      const dtoWithAgent = {
        ...validRequestDto,
        agentId: 'existing-agent',
      };

      const mockAgent = { id: 'existing-agent', name: 'Test Agent' };
      const mockFlow = {
        id: 'flow-123',
        name: dtoWithAgent.name,
        agentId: 'existing-agent',
        status: FlowStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      agentRepository.findOne.mockResolvedValue(mockAgent as any);
      flowRepository.create.mockReturnValue(mockFlow as any);
      flowRepository.save.mockResolvedValue(mockFlow as any);

      const result = await service.execute(dtoWithAgent);

      expect(agentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'existing-agent' },
      });
      expect(result.agentId).toBe('existing-agent');
    });
  });
});
