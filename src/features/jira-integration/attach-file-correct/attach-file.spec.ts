import { Test, TestingModule } from '@nestjs/testing';
import { AttachFileController } from './attach-file.controller';
import { AttachFileService } from './attach-file.service';

describe('AttachFileController (E2E)', () => {
  let controller: AttachFileController;
  let service: AttachFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachFileController],
      providers: [
        {
          provide: AttachFileService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AttachFileController>(AttachFileController);
    service = module.get<AttachFileService>(AttachFileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should attach file to task', async () => {
    const mockRequest = {
      filePath: '/path/to/file.pdf',
      filename: 'document.pdf',
    };

    const mockResponse = {
      success: true,
      taskKey: 'KAN-5',
      message: 'File attached successfully',
    };

    jest.spyOn(service, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('KAN-5', mockRequest);

    expect(service.execute).toHaveBeenCalledWith('KAN-5', mockRequest);
    expect(result).toEqual(mockResponse);
  });
});
