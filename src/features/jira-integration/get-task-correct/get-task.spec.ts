import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskController } from './get-task.controller';
import { GetTaskService } from './get-task.service';

describe('GetTaskController (E2E)', () => {
  let controller: GetTaskController;
  let service: GetTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetTaskController],
      providers: [
        {
          provide: GetTaskService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetTaskController>(GetTaskController);
    service = module.get<GetTaskService>(GetTaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get task by key', async () => {
    const mockResponse = {
      key: 'KAN-5',
      id: '10001',
      self: 'https://test.atlassian.net/rest/api/2/issue/10001',
      fields: {
        summary: 'Test task',
        description: 'Test description',
      },
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('KAN-5');

    expect(service.execute).toHaveBeenCalledWith('KAN-5');
    expect(result).toEqual(mockResponse);
  });
});
