import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteTaskLinkController } from './delete-task-link.controller';
import { DeleteTaskLinkService } from './delete-task-link.service';
import { TaskHistory } from '@/entities/task-history.entity';
describe('DeleteTaskLinkController', () => {
  let controller: DeleteTaskLinkController;
  let service: DeleteTaskLinkService;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteTaskLinkController],
      providers: [
        DeleteTaskLinkService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<DeleteTaskLinkController>(DeleteTaskLinkController);
    service = module.get<DeleteTaskLinkService>(DeleteTaskLinkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    const taskId = '123e4567-e89b-12d3-a456-426614174000';
    const linkId = 'link-456e7890-e89b-12d3-a456-426614174000';

    it('should successfully delete a task link', async () => {
      const requestDto = {
        deletedBy: 'user-123e4567-e89b-12d3-a456-426614174000',
        deleteReason: 'No longer relevant',
      };

      const expectedResponse = {
        taskId,
        linkId,
        linkedTaskId: '789e1234-e89b-12d3-a456-426614174000',
        linkType: 'blocks',
        linkDirection: 'outbound',
        deletedBy: requestDto.deletedBy,
        deletedAt: expect.any(Date),
        deleteReason: requestDto.deleteReason,
        linkedTaskTitle: 'Setup database configuration',
        remainingLinksCount: 0,
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(taskId, linkId, requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(taskId, linkId, requestDto);
    });

    it('should throw NotFoundException when link is not found', async () => {
      const requestDto = {};

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new NotFoundException(
            `Link with ID ${linkId} not found on task ${taskId}`,
          ),
        );

      await expect(
        controller.handle(taskId, linkId, requestDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user lacks permissions', async () => {
      const requestDto = {
        deletedBy: 'unauthorized-user',
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new ForbiddenException(
            'Insufficient permissions to delete task links',
          ),
        );

      await expect(
        controller.handle(taskId, linkId, requestDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
