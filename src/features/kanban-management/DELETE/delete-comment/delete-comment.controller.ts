import { Controller, Delete, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteCommentService } from './delete-comment.service';
import { DeleteCommentRequestDto } from './delete-comment.request.dto';
import { DeleteCommentResponseDto } from './delete-comment.response.dto';
import { ApiDeleteComment } from './delete-comment.openapi.decorator';

@Controller('kanban-management')
@ApiTags('DeleteComment')
export class DeleteCommentController {
  constructor(private readonly service: DeleteCommentService) {}

  @Delete('comment/:commentId')
  @ApiDeleteComment()
  async handle(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() requestDto: DeleteCommentRequestDto,
  ): Promise<DeleteCommentResponseDto> {
    return this.service.execute(commentId, requestDto);
  }
}
