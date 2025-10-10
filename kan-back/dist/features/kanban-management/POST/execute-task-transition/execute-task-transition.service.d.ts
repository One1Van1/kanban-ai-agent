import { Repository } from 'typeorm';
import { TaskHistory } from '@/entities/task-history.entity';
import { ExecuteTaskTransitionRequestDto, TransitionAction } from './execute-task-transition.request.dto';
import { ExecuteTaskTransitionResponseDto } from './execute-task-transition.response.dto';
export declare class ExecuteTaskTransitionService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    executeTransition(taskId: string, requestDto: ExecuteTaskTransitionRequestDto): Promise<ExecuteTaskTransitionResponseDto>;
    private validateTransition;
    private getValidTransitions;
    getAvailableTransitions(taskId: string): Promise<TransitionAction[]>;
}
