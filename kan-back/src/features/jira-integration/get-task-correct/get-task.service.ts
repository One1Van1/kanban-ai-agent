import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { GetTaskResponseDto } from './get-task.response.dto';

@Injectable()
export class GetTaskService extends JiraBaseService {
  async execute(taskKey: string): Promise<GetTaskResponseDto> {
    const task = await this.getTask(taskKey);
    return new GetTaskResponseDto(task);
  }
}
