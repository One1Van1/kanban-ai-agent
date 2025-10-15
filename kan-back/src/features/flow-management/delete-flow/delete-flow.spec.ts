import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteFlowService } from './delete-flow.service';
import { Flow, FlowStatus } from '../../../entities/flow.entity';

describe('DeleteFlowService', () => {
  let service: DeleteFlowService;
  let flowRepository: jest.Mocked<Repository<Flow>>;

  const mockFlowRepository = {
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteFlowService,
        {
          provide: getRepositoryToken(Flow),
          useValue: mockFlowRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteFlowService>(DeleteFlowService);
    flowRepository = module.get(getRepositoryToken(Flow));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const flowId = 'flow-123';
    const mockFlow = {
      id: flowId,
      name: 'Test Flow',
      status: FlowStatus.DRAFT,
    };

    it('should delete flow successfully', async () => {
      flowRepository.findOne.mockResolvedValue(mockFlow as any);
      flowRepository.remove.mockResolvedValue(mockFlow as any);

      const result = await service.execute(flowId);

      expect(flowRepository.findOne).toHaveBeenCalledWith({
        where: { id: flowId },
      });
      expect(flowRepository.remove).toHaveBeenCalledWith(mockFlow);
      expect(result.flowId).toBe(flowId);
      expect(result.message).toBe('Flow deleted successfully');
    });

    it('should throw NotFoundException when flow not found', async () => {
      flowRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(flowId)).rejects.toThrow(NotFoundException);
      expect(flowRepository.remove).not.toHaveBeenCalled();
    });
  });
});
