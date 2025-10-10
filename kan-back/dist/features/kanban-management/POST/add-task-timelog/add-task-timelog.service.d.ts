import { Repository } from 'typeorm';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { AddTaskTimelogRequestDto } from './add-task-timelog.request.dto';
import { AddTaskTimelogResponseDto } from './add-task-timelog.response.dto';
export declare class AddTaskTimelogService {
    private readonly taskHistoryRepository;
    constructor(taskHistoryRepository: Repository<TaskHistory>);
    execute(taskId: string, requestDto: AddTaskTimelogRequestDto): Promise<AddTaskTimelogResponseDto>;
}
