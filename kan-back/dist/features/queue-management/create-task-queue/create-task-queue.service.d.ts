import { Queue } from 'bull';
import { CreateTaskQueueRequestDto, CreateTaskQueueResponseDto } from './create-task-queue.dto';
export declare class CreateTaskQueueService {
    private readonly aiAgentQueue;
    private readonly logger;
    constructor(aiAgentQueue: Queue);
    addTaskToQueue(requestDto: CreateTaskQueueRequestDto): Promise<CreateTaskQueueResponseDto>;
    private getPriorityValue;
}
