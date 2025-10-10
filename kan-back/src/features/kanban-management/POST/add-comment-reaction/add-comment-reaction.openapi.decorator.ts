import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddCommentReactionRequestDto } from './add-comment-reaction.request.dto';
import { AddCommentReactionResponseDto } from './add-comment-reaction.response.dto';

export function ApiAddCommentReaction() {
  return applyDecorators(
    ApiTags('Kanban Management - Comment Reactions'),
    ApiOperation({
      summary: 'Add emoji reaction to comment',
      description: `
        Adds an emoji reaction to a specific comment. This endpoint supports:
        - Predefined emoji reactions (like, heart, laugh, etc.)
        - Custom emoji support
        - Optional reaction notes
        - Duplicate reaction prevention
        - Reaction counting and analytics
        
        Common use cases:
        - Express agreement or disagreement with comments
        - Provide quick feedback without writing full responses
        - Show emotional reactions to comment content
        - Enhance team communication and engagement
        - Track popular opinions and feedback patterns
      `,
      operationId: 'addCommentReaction',
    }),
    ApiParam({
      name: 'commentId',
      description: 'UUID of the comment to add reaction to',
      example: '123e4567-e89b-12d3-a456-426614174000',
      format: 'uuid',
    }),
    ApiBody({
      type: AddCommentReactionRequestDto,
      description: 'Reaction details including type and user information',
      examples: {
        basicLike: {
          summary: 'Basic like reaction',
          description: 'Simple thumbs up reaction',
          value: {
            reactionType: 'like',
            userId: 'user-123e4567-e89b-12d3-a456-426614174000',
          },
        },
        customEmoji: {
          summary: 'Custom emoji reaction',
          description: 'Reaction with custom emoji',
          value: {
            reactionType: 'celebrate',
            userId: 'user-123e4567-e89b-12d3-a456-426614174000',
            customEmoji: '🚀',
            reactionNote: 'Great idea!',
          },
        },
        withNote: {
          summary: 'Reaction with note',
          description: 'Detailed reaction with explanatory note',
          value: {
            reactionType: 'heart',
            userId: 'user-123e4567-e89b-12d3-a456-426614174000',
            reactionNote: 'This really helped me understand the issue',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Reaction successfully added to comment',
      type: AddCommentReactionResponseDto,
      example: {
        commentId: '123e4567-e89b-12d3-a456-426614174000',
        reactionId: 'reaction-456e7890-e89b-12d3-a456-426614174000',
        reactionType: 'like',
        userId: 'user-123e4567-e89b-12d3-a456-426614174000',
        userName: 'John Doe',
        createdAt: '2024-01-15T10:30:00.000Z',
        totalReactions: 5,
        reactionTypeCount: 3,
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
        emojiDisplay: '👍',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters or validation errors',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            oneOf: [
              {
                type: 'string',
                example: 'Validation failed (uuid is expected)',
              },
              {
                type: 'string',
                example: 'reactionType must be a valid enum value',
              },
              { type: 'string', example: 'userId should not be empty' },
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Comment not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example:
              'Comment with ID 123e4567-e89b-12d3-a456-426614174000 not found',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'User already has this type of reaction on the comment',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'User already has a like reaction on this comment',
          },
          error: { type: 'string', example: 'Conflict' },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during reaction creation',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
}
