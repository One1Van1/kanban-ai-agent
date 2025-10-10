import { Controller, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCommentService } from './update-comment.service';
import { UpdateCommentRequestDto } from './update-comment.request.dto';
import { UpdateCommentResponseDto } from './update-comment.response.dto';
import { ApiUpdateComment } from './update-comment.openapi.decorator';

@Controller('kanban-management')
@ApiTags('UpdateComment')
export class UpdateCommentController {
  constructor(private readonly service: UpdateCommentService) {}

  @Patch('comment/:commentId')
  @ApiUpdateComment()
  async handle(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() requestDto: UpdateCommentRequestDto,
  ): Promise<UpdateCommentResponseDto> {
    return this.service.execute(commentId, requestDto);
  }
}
