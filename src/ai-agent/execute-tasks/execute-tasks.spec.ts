import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteTasksService } from './execute-tasks.service';
import { ExecuteTasksController } from './execute-tasks.controller';

describe('ExecuteTasksController', () => {
  let controller: ExecuteTasksController;
  let service: ExecuteTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecuteTasksController],
      providers: [
        {
          provide: ExecuteTasksService,
          useValue: {
            executeTasks: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExecuteTasksController>(ExecuteTasksController);
    service = module.get<ExecuteTasksService>(ExecuteTasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('executeTasks', () => {
    it('should execute tasks and return results', async () => {
      const mockResponse = {
        tasksExecuted: 1,
        successfulExecutions: 1,
        results: [
          {
            taskKey: 'KAN-5',
            executed: true,
            success: true,
            reason: 'Entity Order created successfully',
            filesCreated: ['/path/to/order.entity.ts'],
          },
        ],
      };

      jest.spyOn(service, 'executeTasks').mockResolvedValue(mockResponse);

      const result = await controller.executeTasks();

      expect(result).toEqual(mockResponse);
      expect(service.executeTasks).toHaveBeenCalledTimes(1);
    });
  });
});
