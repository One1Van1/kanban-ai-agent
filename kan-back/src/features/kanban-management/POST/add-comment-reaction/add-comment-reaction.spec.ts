import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AddCommentReactionController } from './add-comment-reaction.controller';
import { AddCommentReactionService } from './add-comment-reaction.service';
import { TaskHistory } from '@/entities/task-history.entity';
import { ReactionType } from './add-comment-reaction.request.dto';

describe('AddCommentReactionController', () => {
  let controller: AddCommentReactionController;
  let service: AddCommentReactionService;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddCommentReactionController],
      providers: [
        AddCommentReactionService,
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<AddCommentReactionController>(
      AddCommentReactionController,
    );
    service = module.get<AddCommentReactionService>(AddCommentReactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    const commentId = '123e4567-e89b-12d3-a456-426614174000';

    it('should successfully add a reaction to comment', async () => {
      const requestDto = {
        reactionType: ReactionType.LIKE,
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResponse = {
        commentId,
        reactionId: 'reaction-456e7890-e89b-12d3-a456-426614174000',
        reactionType: ReactionType.LIKE,
        userId: requestDto.userId,
        userName: 'John Doe',
        createdAt: expect.any(Date),
        totalReactions: 1,
        reactionTypeCount: 1,
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        emojiDisplay: '👍',
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(commentId, requestDto);

      expect(result).toEqual(expectedResponse);
      expect(service.execute).toHaveBeenCalledWith(commentId, requestDto);
    });

    it('should add custom emoji reaction', async () => {
      const requestDto = {
        reactionType: ReactionType.CELEBRATE,
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
        customEmoji: '🚀',
        reactionNote: 'Great idea!',
      };

      const expectedResponse = {
        commentId,
        reactionId: 'reaction-456e7890-e89b-12d3-a456-426614174000',
        reactionType: ReactionType.CELEBRATE,
        userId: requestDto.userId,
        userName: 'John Doe',
        customEmoji: '🚀',
        reactionNote: 'Great idea!',
        createdAt: expect.any(Date),
        totalReactions: 2,
        reactionTypeCount: 1,
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        emojiDisplay: '🚀',
      };

      jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

      const result = await controller.handle(commentId, requestDto);

      expect(result).toEqual(expectedResponse);
      expect(result.customEmoji).toBe('🚀');
      expect(result.reactionNote).toBe('Great idea!');
    });

    it('should throw NotFoundException when comment is not found', async () => {
      const requestDto = {
        reactionType: ReactionType.LIKE,
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new NotFoundException(`Comment with ID ${commentId} not found`),
        );

      await expect(controller.handle(commentId, requestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when user already reacted', async () => {
      const requestDto = {
        reactionType: ReactionType.LIKE,
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
      };

      jest
        .spyOn(service, 'execute')
        .mockRejectedValue(
          new ConflictException(
            'User already has a like reaction on this comment',
          ),
        );

      await expect(controller.handle(commentId, requestDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle different reaction types', async () => {
      const reactionTypes = [
        ReactionType.HEART,
        ReactionType.LAUGH,
        ReactionType.SURPRISED,
        ReactionType.ANGRY,
      ];

      for (const reactionType of reactionTypes) {
        const requestDto = {
          reactionType,
          userId: `user-${Date.now()}`,
        };

        const expectedResponse = {
          commentId,
          reactionId: `reaction-${Date.now()}`,
          reactionType,
          userId: requestDto.userId,
          userName: 'Test User',
          createdAt: expect.any(Date),
          totalReactions: 1,
          reactionTypeCount: 1,
          success: true,
          historyLogId: `hist-${Date.now()}`,
          emojiDisplay: expect.any(String),
        };

        jest.spyOn(service, 'execute').mockResolvedValue(expectedResponse);

        const result = await controller.handle(commentId, requestDto);

        expect(result.reactionType).toBe(reactionType);
        expect(service.execute).toHaveBeenCalledWith(commentId, requestDto);
      }
    });
  });
});
