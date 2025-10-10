import { Test, TestingModule } from '@nestjs/testing';
import { GetColumnTasksController } from './get-column-tasks.controller';
import { GetColumnTasksService } from './get-column-tasks.service';

describe('GetColumnTasksController (E2E)', () => {
  let controller: GetColumnTasksController;
  let service: GetColumnTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetColumnTasksController],
      providers: [
        {
          provide: GetColumnTasksService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetColumnTasksController>(GetColumnTasksController);
    service = module.get<GetColumnTasksService>(GetColumnTasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get tasks from column', async () => {
    const mockResponse = {
      tasks: [],
      columnStatus: 'In Progress',
      total: 0,
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('In Progress', {});

    expect(service.execute).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
