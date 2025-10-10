import { Test, TestingModule } from '@nestjs/testing';
import { SearchTasksController } from './search-tasks.controller';
import { SearchTasksService } from './search-tasks.service';

describe('SearchTasksController (E2E)', () => {
  let controller: SearchTasksController;
  let service: SearchTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchTasksController],
      providers: [
        {
          provide: SearchTasksService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchTasksController>(SearchTasksController);
    service = module.get<SearchTasksService>(SearchTasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should search tasks by JQL', async () => {
    const mockRequest = {
      jql: 'project = "KAN" AND status = "In Progress"',
      maxResults: 20,
      startAt: 0,
    };

    const mockResponse = {
      issues: [
        {
          key: 'KAN-5',
          id: '10001',
          self: 'https://test.atlassian.net/rest/api/2/issue/10001',
          fields: { summary: 'Test task' },
        },
      ],
      total: 1,
      startAt: 0,
      maxResults: 20,
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(service.execute).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
