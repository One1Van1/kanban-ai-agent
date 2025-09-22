import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../shared/jira-base.service';
import { GetTaskResponse } from './get-task.interface';

@Injectable()
export class GetTaskService extends JiraBaseService {
  async getTaskByKey(taskKey: string): Promise<GetTaskResponse> {
    return this.getTask(taskKey);
  }
}
