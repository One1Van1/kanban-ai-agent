import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateCommentService } from './update-comment.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { UpdateCommentRequestDto } from './update-comment.request.dto';

describe('UpdateCommentService', () => {
  let service: UpdateCommentService;
  let taskHistoryRepository: Repository<TaskHistory>;

  const mockTaskHistoryRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockComment = {
    id: 'hist-comment-123',
    taskId: 'task-123',
    taskKey: 'TASK-123',
    taskTitle: 'Comment: This is the original comment content',
    action: 'comment_added',
    agentId: 'user-789',
    createdAt: new Date('2024-01-10T08:15:00.000Z'),
    fromStatus: 'In Progress',
    toStatus: 'In Progress',
    fromColumn: 'In Progress',
    toColumn: 'In Progress',
    context: {
      commentData: {
        content: 'This is the original comment content',
      },
    },
    agentResponse: {
      commentId: 'comment-456',
      content: 'This is the original comment content',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCommentService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateCommentService>(UpdateCommentService);
    taskHistoryRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    const commentId = 'comment-456';
    const mockRequest: UpdateCommentRequestDto = {
      content:
        'Updated: This is the corrected comment content with additional details',
      updatedBy: 'user-789',
      updateReason: 'Fixed typo and added clarification',
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(mockComment);
      mockTaskHistoryRepository.count.mockResolvedValue(1); // One previous edit
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({
        id: 'hist-456',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
      });
    });

    it('should successfully update a comment', async () => {
      const result = await service.execute(commentId, mockRequest);

      expect(result).toEqual({
        commentId: 'comment-456',
        taskId: 'task-123',
        content:
          'Updated: This is the corrected comment content with additional details',
        originalContent: 'This is the original comment content',
        originalAuthor: 'user-789',
        updatedBy: 'user-789',
        originalCreatedAt: expect.any(Date),
        updatedAt: expect.any(Date),
        updateReason: 'Fixed typo and added clarification',
        isEdited: true,
        editCount: 2,
        contentLength: 69,
        success: true,
        historyLogId: 'hist-456',
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when comment does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(commentId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle comment with no previous edits', async () => {
      mockTaskHistoryRepository.count.mockResolvedValue(0); // No previous edits

      const result = await service.execute(commentId, mockRequest);

      expect(result.editCount).toBe(1);
      expect(result.isEdited).toBe(true);
    });

    it('should handle comment with minimal data', async () => {
      const minimalComment = {
        ...mockComment,
        context: {},
        agentResponse: {
          commentId: 'comment-456',
        },
        taskTitle: 'Minimal comment',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(minimalComment);

      const result = await service.execute(commentId, mockRequest);

      expect(result.originalContent).toBe('Minimal comment');
      expect(result.content).toBe(mockRequest.content);
    });

    it('should extract content from different sources', async () => {
      const commentWithAgentResponse = {
        ...mockComment,
        context: {},
        agentResponse: {
          commentId: 'comment-456',
          content: 'Content from agentResponse',
        },
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(
        commentWithAgentResponse,
      );

      const result = await service.execute(commentId, mockRequest);

      expect(result.originalContent).toBe('Content from agentResponse');
    });

    it('should fall back to taskTitle when no content available', async () => {
      const commentWithoutContent = {
        ...mockComment,
        context: {},
        agentResponse: {
          commentId: 'comment-456',
        },
        taskTitle: 'Fallback content from title',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(
        commentWithoutContent,
      );

      const result = await service.execute(commentId, mockRequest);

      expect(result.originalContent).toBe('Fallback content from title');
    });

    it('should handle very long content correctly', async () => {
      const longContent = 'a'.repeat(1500);
      const longRequest: UpdateCommentRequestDto = {
        content: longContent,
        updatedBy: 'user-789',
      };

      const result = await service.execute(commentId, longRequest);

      expect(result.content).toBe(longContent);
      expect(result.contentLength).toBe(1500);
    });

    it('should handle update without updatedBy field', async () => {
      const requestWithoutUser: UpdateCommentRequestDto = {
        content: 'Updated content without user',
      };

      const result = await service.execute(commentId, requestWithoutUser);

      expect(result.updatedBy).toBeUndefined();
      expect(result.success).toBe(true);
    });

    it('should handle update without updateReason', async () => {
      const requestWithoutReason: UpdateCommentRequestDto = {
        content: 'Updated content without reason',
        updatedBy: 'user-123',
      };

      const result = await service.execute(commentId, requestWithoutReason);

      expect(result.updateReason).toBeUndefined();
      expect(result.success).toBe(true);
    });

    it('should track edit count correctly for multiple edits', async () => {
      mockTaskHistoryRepository.count.mockResolvedValue(5); // Five previous edits

      const result = await service.execute(commentId, mockRequest);

      expect(result.editCount).toBe(6);
    });

    it('should create proper history log with all context', async () => {
      await service.execute(commentId, mockRequest);

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith({
        agentId: 'user-789',
        taskId: 'task-123',
        taskKey: 'TASK-123',
        taskTitle:
          'Updated comment: Updated: This is the corrected comment content with...',
        action: 'comment_updated',
        fromStatus: 'In Progress',
        toStatus: 'In Progress',
        fromColumn: 'In Progress',
        toColumn: 'In Progress',
        status: 'completed',
        context: {
          commentId: 'comment-456',
          originalContent: 'This is the original comment content',
          updatedContent:
            'Updated: This is the corrected comment content with additional details',
          updateReason: 'Fixed typo and added clarification',
          editCount: 2,
          commentData: {
            content:
              'Updated: This is the corrected comment content with additional details',
            editCount: 2,
            lastEditedBy: 'user-789',
            lastEditedAt: expect.any(Date),
          },
        },
        agentResponse: {
          success: true,
          commentUpdated: true,
          commentId: 'comment-456',
          content:
            'Updated: This is the corrected comment content with additional details',
          originalContent: 'This is the original comment content',
          editCount: 2,
          timestamp: expect.any(String),
        },
      });
    });
  });
});
