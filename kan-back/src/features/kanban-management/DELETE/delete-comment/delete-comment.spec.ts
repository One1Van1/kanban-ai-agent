import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteCommentService } from './delete-comment.service';
import { TaskHistory } from '../../../../entities/task-history.entity';
import {
  DeleteCommentRequestDto,
  CommentDeleteMode,
} from './delete-comment.request.dto';

describe('DeleteCommentService', () => {
  let service: DeleteCommentService;
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
    taskTitle: 'Comment: This is a test comment',
    action: 'comment_added',
    agentId: 'user-789',
    createdAt: new Date('2024-01-10T08:15:00.000Z'),
    fromStatus: 'In Progress',
    toStatus: 'In Progress',
    fromColumn: 'In Progress',
    toColumn: 'In Progress',
    context: {
      commentData: {
        content: 'This is a test comment content',
      },
    },
    agentResponse: {
      commentId: 'comment-456',
      content: 'This is a test comment content',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCommentService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockTaskHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteCommentService>(DeleteCommentService);
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
    const mockRequest: DeleteCommentRequestDto = {
      deleteMode: CommentDeleteMode.SOFT_DELETE,
      deletedBy: 'user-789',
      deleteReason: 'Comment no longer relevant',
    };

    beforeEach(() => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(mockComment);
      mockTaskHistoryRepository.count.mockResolvedValue(6); // Total comments on task
      mockTaskHistoryRepository.create.mockReturnValue({ id: 'hist-456' });
      mockTaskHistoryRepository.save.mockResolvedValue({
        id: 'hist-456',
        createdAt: new Date('2024-01-15T10:30:00.000Z'),
      });
    });

    it('should successfully soft delete a comment', async () => {
      const result = await service.execute(commentId, mockRequest);

      expect(result).toEqual({
        commentId: 'comment-456',
        taskId: 'task-123',
        content: 'This is a test comment content',
        deleteMode: CommentDeleteMode.SOFT_DELETE,
        originalAuthor: 'user-789',
        deletedBy: 'user-789',
        originalCreatedAt: expect.any(Date),
        deletedAt: expect.any(Date),
        deleteReason: 'Comment no longer relevant',
        canBeRestored: true,
        remainingCommentsCount: 5,
        success: true,
        historyLogId: 'hist-456',
      });

      expect(mockTaskHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully hard delete a comment', async () => {
      const hardDeleteRequest: DeleteCommentRequestDto = {
        deleteMode: CommentDeleteMode.HARD_DELETE,
        deletedBy: 'admin-123',
        deleteReason: 'Comment violates guidelines',
      };

      const result = await service.execute(commentId, hardDeleteRequest);

      expect(result.deleteMode).toBe(CommentDeleteMode.HARD_DELETE);
      expect(result.canBeRestored).toBe(false);
      expect(result.deletedBy).toBe('admin-123');
      expect(result.deleteReason).toBe('Comment violates guidelines');
    });

    it('should throw NotFoundException when comment does not exist', async () => {
      mockTaskHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.execute(commentId, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle comment with minimal data', async () => {
      const minimalComment = {
        ...mockComment,
        context: {},
        agentResponse: {
          commentId: 'comment-456',
        },
        taskTitle: 'Minimal comment title',
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(minimalComment);

      const result = await service.execute(commentId, mockRequest);

      expect(result.content).toBe('Minimal comment title');
      expect(result.success).toBe(true);
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

      expect(result.content).toBe('Content from agentResponse');
    });

    it('should fall back to no content available', async () => {
      const commentWithoutContent = {
        ...mockComment,
        context: {},
        agentResponse: {
          commentId: 'comment-456',
        },
        taskTitle: null,
      };

      mockTaskHistoryRepository.findOne.mockResolvedValue(
        commentWithoutContent,
      );

      const result = await service.execute(commentId, mockRequest);

      expect(result.content).toBe('No content available');
    });

    it('should calculate remaining comments count correctly', async () => {
      mockTaskHistoryRepository.count.mockResolvedValue(1); // Only this comment

      const result = await service.execute(commentId, mockRequest);

      expect(result.remainingCommentsCount).toBe(0);
    });

    it('should handle deletion without deletedBy field', async () => {
      const requestWithoutUser: DeleteCommentRequestDto = {
        deleteMode: CommentDeleteMode.SOFT_DELETE,
      };

      const result = await service.execute(commentId, requestWithoutUser);

      expect(result.deletedBy).toBeUndefined();
      expect(result.success).toBe(true);
    });

    it('should handle deletion without deleteReason', async () => {
      const requestWithoutReason: DeleteCommentRequestDto = {
        deleteMode: CommentDeleteMode.SOFT_DELETE,
        deletedBy: 'user-123',
      };

      const result = await service.execute(commentId, requestWithoutReason);

      expect(result.deleteReason).toBeUndefined();
      expect(result.success).toBe(true);
    });

    it('should default to SOFT_DELETE when deleteMode not specified', async () => {
      const requestWithoutMode: DeleteCommentRequestDto = {
        deletedBy: 'user-123',
      };

      const result = await service.execute(commentId, requestWithoutMode);

      expect(result.deleteMode).toBe(CommentDeleteMode.SOFT_DELETE);
      expect(result.canBeRestored).toBe(true);
    });

    it('should create proper deletion history log', async () => {
      await service.execute(commentId, mockRequest);

      expect(mockTaskHistoryRepository.create).toHaveBeenCalledWith({
        agentId: 'user-789',
        taskId: 'task-123',
        taskKey: 'TASK-123',
        taskTitle: 'Deleted comment: This is a test comment content...',
        action: 'comment_deleted',
        fromStatus: 'In Progress',
        toStatus: 'In Progress',
        fromColumn: 'In Progress',
        toColumn: 'In Progress',
        status: 'completed',
        context: {
          commentId: 'comment-456',
          deletedContent: 'This is a test comment content',
          deleteMode: CommentDeleteMode.SOFT_DELETE,
          deleteReason: 'Comment no longer relevant',
          originalAuthor: 'user-789',
          originalCreatedAt: expect.any(Date),
        },
        agentResponse: {
          success: true,
          commentDeleted: true,
          commentId: 'comment-456',
          deleteMode: CommentDeleteMode.SOFT_DELETE,
          canBeRestored: true,
          timestamp: expect.any(String),
        },
      });
    });

    it('should handle task with many comments', async () => {
      mockTaskHistoryRepository.count.mockResolvedValue(100); // Many comments

      const result = await service.execute(commentId, mockRequest);

      expect(result.remainingCommentsCount).toBe(99);
    });
  });
});
