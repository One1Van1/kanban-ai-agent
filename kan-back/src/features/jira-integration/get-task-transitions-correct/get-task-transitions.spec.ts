import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskTransitionsController } from './get-task-transitions.controller';
import { GetTaskTransitionsService } from './get-task-transitions.service';

describe('GetTaskTransitionsController (E2E)', () => {
  let controller: GetTaskTransitionsController;
  let service: GetTaskTransitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetTaskTransitionsController],
      providers: [
        {
          provide: GetTaskTransitionsService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetTaskTransitionsController>(
      GetTaskTransitionsController,
    );
    service = module.get<GetTaskTransitionsService>(GetTaskTransitionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get task transitions', async () => {
    const mockResponse = {
      taskKey: 'KAN-5',
      transitions: [],
      total: 0,
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('KAN-5');

    expect(service.execute).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
