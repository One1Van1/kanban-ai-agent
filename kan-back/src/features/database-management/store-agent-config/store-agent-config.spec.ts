import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreAgentConfigService } from './store-agent-config.service';
import { Agent } from '../../../entities/agent.entity';
import { AgentInstruction } from '../../../entities/agent-instruction.entity';
import { StoreAgentConfigRequestDto } from './store-agent-config.request.dto';
import { NotFoundException } from '@nestjs/common';

describe('StoreAgentConfigService', () => {
  let service: StoreAgentConfigService;
  let agentRepository: jest.Mocked<Repository<Agent>>;
  let instructionRepository: jest.Mocked<Repository<AgentInstruction>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreAgentConfigService,
        {
          provide: getRepositoryToken(Agent),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AgentInstruction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreAgentConfigService>(StoreAgentConfigService);
    agentRepository = module.get(getRepositoryToken(Agent));
    instructionRepository = module.get(getRepositoryToken(AgentInstruction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should create new agent when agentId is not provided', async () => {
      const requestDto: StoreAgentConfigRequestDto = {
        name: 'Test Agent',
        description: 'Test Description',
        status: 'active',
        config: { key: 'value' },
        instructions: [
          {
            columnId: 'COL1',
            columnName: 'To Do',
            instruction: 'Test instruction',
            triggerEvent: 'on_enter',
          },
        ],
      };

      const mockAgent = { id: 'agent-uuid', ...requestDto };
      const mockInstruction = { id: 'instruction-uuid', agentId: 'agent-uuid' };

      agentRepository.create.mockReturnValue(mockAgent as Agent);
      agentRepository.save.mockResolvedValue(mockAgent as Agent);
      instructionRepository.create.mockReturnValue(
        mockInstruction as AgentInstruction,
      );
      instructionRepository.save.mockResolvedValue(mockInstruction as any);

      const result = await service.execute(requestDto);

      expect(result.agentId).toBe('agent-uuid');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Agent configuration created successfully');
      expect(agentRepository.create).toHaveBeenCalledWith({
        name: requestDto.name,
        description: requestDto.description,
        status: requestDto.status,
        config: requestDto.config,
        jiraInstanceUrl: undefined,
        jiraProjectKey: undefined,
        jiraApiToken: undefined,
        contextSources: undefined,
        notificationSettings: undefined,
        createdBy: undefined,
      });
    });

    it('should update existing agent when agentId is provided', async () => {
      const requestDto: StoreAgentConfigRequestDto = {
        agentId: 'existing-agent-id',
        name: 'Updated Agent',
        description: 'Updated Description',
      };

      const existingAgent = {
        id: 'existing-agent-id',
        name: 'Old Name',
        description: 'Old Description',
        status: 'active',
        config: {},
        contextSources: {},
        notificationSettings: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        instructions: [],
        taskHistories: [],
      };

      agentRepository.findOne.mockResolvedValue(existingAgent as Agent);
      agentRepository.save.mockResolvedValue(existingAgent as Agent);

      const result = await service.execute(requestDto);

      expect(result.agentId).toBe('existing-agent-id');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Agent configuration updated successfully');
      expect(agentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'existing-agent-id' },
        relations: ['instructions'],
      });
    });

    it('should throw NotFoundException when updating non-existent agent', async () => {
      const requestDto: StoreAgentConfigRequestDto = {
        agentId: 'non-existent-id',
        name: 'Updated Agent',
      };

      agentRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(requestDto)).rejects.toThrow(
        new NotFoundException('Agent with ID non-existent-id not found'),
      );
    });
  });
});
