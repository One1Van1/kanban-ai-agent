import { Controller, Post, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddCommentReactionService } from './add-comment-reaction.service';
import { AddCommentReactionRequestDto } from './add-comment-reaction.request.dto';
import { AddCommentReactionResponseDto } from './add-comment-reaction.response.dto';
import { ApiAddCommentReaction } from './add-comment-reaction.openapi.decorator';

@Controller('kanban-management')
@ApiTags('AddCommentReaction')
export class AddCommentReactionController {
  constructor(private readonly service: AddCommentReactionService) {}

  @Post('comment/:commentId/reactions')
  @ApiAddCommentReaction()
  async handle(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() requestDto: AddCommentReactionRequestDto,
  ): Promise<AddCommentReactionResponseDto> {
    return this.service.execute(commentId, requestDto);
  }
}
