import {
  Controller,
  Post,
  Param,
  Body,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TrackAgentInTaskService } from './track-agent-in-task.service';
import { TrackAgentInTaskRequestDto } from './track-agent-in-task.request.dto';
import { TrackAgentInTaskResponseDto } from './track-agent-in-task.response.dto';
import { TrackAgentInTaskOpenApiDecorator } from './track-agent-in-task.openapi.decorator';

@Controller('ai-agent')
export class TrackAgentInTaskController {
  private readonly logger = new Logger(TrackAgentInTaskController.name);

  constructor(
    private readonly trackAgentInTaskService: TrackAgentInTaskService,
  ) {}

  @Post('track-agent-in-task/:agentId')
  @TrackAgentInTaskOpenApiDecorator()
  async trackAgentInTask(
    @Param('agentId') agentId: string,
    @Body() requestDto: TrackAgentInTaskRequestDto,
  ): Promise<TrackAgentInTaskResponseDto> {
    try {
      this.logger.log(
        `Received request to track agent ${agentId} in task ${requestDto.taskId}`,
      );

      if (!agentId || agentId.trim() === '') {
        throw new HttpException('Agent ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.trackAgentInTaskService.execute(
        agentId,
        requestDto,
      );

      this.logger.log(
        `Successfully started tracking for agent ${agentId} in task ${requestDto.taskId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to track agent ${agentId} in task: ${error.message}`,
        error,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      if (error.message.includes('not active')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Internal server error while tracking agent in task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
