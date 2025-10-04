import { Test, TestingModule } from '@nestjs/testing';
import { MoveTaskController } from './move-task.controller';
import { MoveTaskService } from './move-task.service';

describe('MoveTaskController (E2E)', () => {
  let controller: MoveTaskController;
  let service: MoveTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoveTaskController],
      providers: [
        {
          provide: MoveTaskService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoveTaskController>(MoveTaskController);
    service = module.get<MoveTaskService>(MoveTaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should move task to new column', async () => {
    const mockRequest = {
      targetColumn: 'Done',
      comment: 'Задача выполнена',
    };

    const mockResponse = {
      success: true,
      taskKey: 'KAN-5',
      previousStatus: 'In Progress',
      newStatus: 'Done',
      message: 'Task moved successfully',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('KAN-5', mockRequest);

    expect(service.execute).toHaveBeenCalledWith('KAN-5', mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
