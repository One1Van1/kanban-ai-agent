import { Test, TestingModule } from '@nestjs/testing';
import { TrackAgentInTaskController } from './track-agent-in-task.controller';
import { TrackAgentInTaskService } from './track-agent-in-task.service';
import { TrackAgentInTaskRequestDto } from './track-agent-in-task.request.dto';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

describe('TrackAgentInTaskController', () => {
  let controller: TrackAgentInTaskController;
  let service: TrackAgentInTaskService;

  const mockTrackAgentInTaskService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackAgentInTaskController],
      providers: [
        {
          provide: TrackAgentInTaskService,
          useValue: mockTrackAgentInTaskService,
        },
      ],
    }).compile();

    controller = module.get<TrackAgentInTaskController>(
      TrackAgentInTaskController,
    );
    service = module.get<TrackAgentInTaskService>(TrackAgentInTaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trackAgentInTask', () => {
    const mockRequestDto: TrackAgentInTaskRequestDto = {
      taskId: 'TASK-123',
      boardId: 'board-456',
      columnId: 'col-789',
      columnName: 'In Progress',
      triggerType: 'task_moved_to_column',
      taskData: {
        summary: 'Test task',
        status: 'In Progress',
      },
    };

    const mockResponse = {
      success: true,
      agentId: 'agent-123',
      taskId: 'TASK-123',
      message: 'Agent "Test Agent" is now tracking task TASK-123',
      tracking: {
        agentId: 'agent-123',
        taskId: 'TASK-123',
        boardId: 'board-456',
        columnId: 'col-789',
        columnName: 'In Progress',
        isActive: true,
        startedAt: '2024-01-01T10:00:00.000Z',
      },
      nextActions: [
        'Analyze task in column "In Progress"',
        'Monitor task progress',
      ],
    };

    it('should successfully track agent in task', async () => {
      mockTrackAgentInTaskService.execute.mockResolvedValue(mockResponse);

      const result = await controller.trackAgentInTask(
        'agent-123',
        mockRequestDto,
      );

      expect(service.execute).toHaveBeenCalledWith('agent-123', mockRequestDto);
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequest for empty agent ID', async () => {
      await expect(
        controller.trackAgentInTask('', mockRequestDto),
      ).rejects.toThrow(
        new HttpException('Agent ID is required', HttpStatus.BAD_REQUEST),
      );

      expect(service.execute).not.toHaveBeenCalled();
    });

    it('should throw BadRequest for whitespace-only agent ID', async () => {
      await expect(
        controller.trackAgentInTask('   ', mockRequestDto),
      ).rejects.toThrow(
        new HttpException('Agent ID is required', HttpStatus.BAD_REQUEST),
      );

      expect(service.execute).not.toHaveBeenCalled();
    });

    it('should throw NotFound when agent is not found', async () => {
      const error = new Error('Agent with ID agent-999 not found');
      mockTrackAgentInTaskService.execute.mockRejectedValue(error);

      await expect(
        controller.trackAgentInTask('agent-999', mockRequestDto),
      ).rejects.toThrow(
        new HttpException(
          'Agent with ID agent-999 not found',
          HttpStatus.NOT_FOUND,
        ),
      );

      expect(service.execute).toHaveBeenCalledWith('agent-999', mockRequestDto);
    });

    it('should throw BadRequest when agent is not active', async () => {
      const error = new Error(
        'Agent agent-123 is not active and cannot track tasks',
      );
      mockTrackAgentInTaskService.execute.mockRejectedValue(error);

      await expect(
        controller.trackAgentInTask('agent-123', mockRequestDto),
      ).rejects.toThrow(
        new HttpException(
          'Agent agent-123 is not active and cannot track tasks',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(service.execute).toHaveBeenCalledWith('agent-123', mockRequestDto);
    });

    it('should throw InternalServerError for unexpected errors', async () => {
      const error = new Error('Unexpected database error');
      mockTrackAgentInTaskService.execute.mockRejectedValue(error);

      await expect(
        controller.trackAgentInTask('agent-123', mockRequestDto),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error while tracking agent in task',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(service.execute).toHaveBeenCalledWith('agent-123', mockRequestDto);
    });

    it('should re-throw HttpException from service', async () => {
      const httpException = new HttpException(
        'Custom error',
        HttpStatus.FORBIDDEN,
      );
      mockTrackAgentInTaskService.execute.mockRejectedValue(httpException);

      await expect(
        controller.trackAgentInTask('agent-123', mockRequestDto),
      ).rejects.toThrow(httpException);

      expect(service.execute).toHaveBeenCalledWith('agent-123', mockRequestDto);
    });
  });
});
