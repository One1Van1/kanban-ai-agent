import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetTaskTransitionsRequestDto } from './get-task-transitions.request.dto';
import { GetTaskTransitionsResponseDto } from './get-task-transitions.response.dto';

@Injectable()
export class GetTaskTransitionsService extends JiraBaseService {
  async execute(
    requestDto: GetTaskTransitionsRequestDto,
  ): Promise<GetTaskTransitionsResponseDto> {
    try {
      const transitionsResponse = await this.getTaskTransitions(
        requestDto.taskKey,
      );

      return new GetTaskTransitionsResponseDto(
        requestDto.taskKey,
        transitionsResponse.transitions,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get transitions for task: ${requestDto.taskKey}`,
        error.stack,
      );
      throw error;
    }
  }
}
