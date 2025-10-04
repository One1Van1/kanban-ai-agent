import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { TransitionResponse } from './get-task-transitions.interface';

@Injectable()
export class GetTaskTransitionsService extends JiraBaseService {
  async getAvailableTransitions(
    taskKey: string,
  ): Promise<TransitionResponse[]> {
    const transitions = await this.getTaskTransitions(taskKey);
    return transitions.transitions.map((transition: any) => ({
      id: transition.id,
      name: transition.name,
      fromStatusId: '',
      fromStatusName: '',
      toStatusId: transition.to.id,
      toStatusName: transition.to.name,
      isAvailable: true,
    }));
  }
}
