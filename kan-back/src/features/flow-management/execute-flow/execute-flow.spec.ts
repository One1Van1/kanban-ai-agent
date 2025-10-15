import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ExecuteFlowService } from './execute-flow.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';
import { ExecuteFlowRequestDto } from './execute-flow.request.dto';

describe('ExecuteFlowService', () => {
  let service: ExecuteFlowService;
  let flowRepository: jest.Mocked<Repository<Flow>>;

  const mockFlowRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecuteFlowService,
        {
          provide: getRepositoryToken(Flow),
          useValue: mockFlowRepository,
        },
      ],
    }).compile();

    service = module.get<ExecuteFlowService>(ExecuteFlowService);
    flowRepository = module.get(getRepositoryToken(Flow));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const flowId = 'flow-123';
    const requestDto: ExecuteFlowRequestDto = {
      context: { taskId: 'task-123', boardColumn: 'In Progress' },
      executedBy: 'user-456',
    };

    const activeFlow = {
      id: flowId,
      name: 'Test Flow',
      status: FlowStatus.ACTIVE,
      definition: {
        blocks: [
          {
            id: 'b1',
            type: 'extract_files',
            configuration: { fileTypes: ['pdf', 'doc'] },
          },
          {
            id: 'b2',
            type: 'ai_request',
            configuration: { prompt: 'Analyze content' },
          },
          {
            id: 'b3',
            type: 'move_card',
            configuration: { targetColumn: 'Done' },
          },
        ],
        edges: [
          { id: 'e1', source: 'b1', target: 'b2' },
          { id: 'e2', source: 'b2', target: 'b3' },
        ],
      },
    };

    it('should execute flow successfully', async () => {
      flowRepository.findOne.mockResolvedValue(activeFlow as any);

      const result = await service.execute(flowId, requestDto);

      expect(flowRepository.findOne).toHaveBeenCalledWith({
        where: { id: flowId },
      });
      expect(result.flowId).toBe(flowId);
      expect(result.flowName).toBe('Test Flow');
      expect(result.status).toBe('queued');
      expect(result.executedBy).toBe('user-456');
      expect(result.instructions).toBeDefined();
      expect(result.instructions.length).toBeGreaterThan(0);
    });

    it('should throw NotFoundException when flow not found', async () => {
      flowRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(flowId, requestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when flow is not active', async () => {
      const draftFlow = { ...activeFlow, status: FlowStatus.DRAFT };
      flowRepository.findOne.mockResolvedValue(draftFlow as any);

      await expect(service.execute(flowId, requestDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when flow has no blocks', async () => {
      const emptyFlow = {
        ...activeFlow,
        definition: { blocks: [], edges: [] },
      };
      flowRepository.findOne.mockResolvedValue(emptyFlow as any);

      await expect(service.execute(flowId, requestDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should generate instructions in correct order', async () => {
      flowRepository.findOne.mockResolvedValue(activeFlow as any);

      const result = await service.execute(flowId, requestDto);

      expect(result.instructions[0]).toContain('1. Извлеки');
      expect(result.instructions[1]).toContain('2. Выполни AI анализ');
      expect(result.instructions[2]).toContain('3. Перемести карточку');
    });

    it('should include context in instructions', async () => {
      flowRepository.findOne.mockResolvedValue(activeFlow as any);

      const result = await service.execute(flowId, requestDto);

      expect(result.instructions[0]).toContain('task-123');
      expect(result.instructions[2]).toContain('Done');
    });

    it('should handle blocks without configuration', async () => {
      const flowWithoutConfig = {
        ...activeFlow,
        definition: {
          blocks: [
            { id: 'b1', type: 'extract_files' }, // No configuration
          ],
          edges: [],
        },
      };

      flowRepository.findOne.mockResolvedValue(flowWithoutConfig as any);

      const result = await service.execute(flowId, requestDto);

      expect(result.instructions[0]).toContain('1. Извлеки все файлы');
    });
  });
});
