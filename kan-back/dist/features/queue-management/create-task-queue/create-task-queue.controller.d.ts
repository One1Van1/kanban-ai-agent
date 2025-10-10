import { CreateTaskQueueService } from './create-task-queue.service';
import { CreateTaskQueueRequestDto, CreateTaskQueueResponseDto } from './create-task-queue.dto';
export declare class CreateTaskQueueController {
    private readonly createTaskQueueService;
    private readonly logger;
    constructor(createTaskQueueService: CreateTaskQueueService);
    handle(requestDto: CreateTaskQueueRequestDto): Promise<CreateTaskQueueResponseDto>;
}
